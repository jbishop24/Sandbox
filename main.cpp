#include <SFML/Graphics.hpp>
#include <SFML/OpenGL.hpp>

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Sandbox");
    window.setFramerateLimit(240);


    // 1. Create two render textures for ping-ponging
    sf::RenderTexture bufferA, bufferB;
    bufferA.create(800, 600);
    bufferB.create(800, 600);
    bufferA.setSmooth(false);
    bufferB.setSmooth(false);
    bufferA.clear(sf::Color::Black);
    bufferB.clear(sf::Color::Black);

    // Pointers to easily swap them
    sf::RenderTexture* readBuffer  = &bufferA;
    sf::RenderTexture* writeBuffer = &bufferB;

    // 2. Load the simulation shader
    sf::Shader simShader;
    simShader.loadFromFile("/home/jon/Sandbox/test.frag", sf::Shader::Fragment);

    // Create a full-screen sprite to map textures onto
    sf::Sprite simSprite;
    sf::Sprite windowSprite; // Used to draw final result to window

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close();
            }
            if (event.type == sf::Event::KeyPressed && event.key.code == sf::Keyboard::Key::Escape) {
                window.close();
            }
        }

        // 3. Track mouse interaction
        sf::Vector2i mousePos = sf::Mouse::getPosition(window);
        bool isLeftPressed = sf::Mouse::isButtonPressed(sf::Mouse::Left);

        // 4. Update uniforms
        simShader.setUniform("u_texture", readBuffer->getTexture());
        simShader.setUniform("u_resolution", sf::Glsl::Vec2(800.0, 600.0));
        simShader.setUniform("u_mouse", sf::Glsl::Vec2(mousePos.x, 600.0f - mousePos.y));
        simShader.setUniform("u_mouse_pressed", isLeftPressed ? 1.0f : 0.0f);

        // 5. Perform the simulation step
        simSprite.setTexture(readBuffer->getTexture());
        writeBuffer->clear(sf::Color::Black);
        writeBuffer->draw(simSprite, &simShader);
        writeBuffer->display();

        // 6. Draw the result to the main window
        windowSprite.setTexture(writeBuffer->getTexture());
        window.clear();
        window.draw(windowSprite);
        window.display();

        // 7. SWAP THE BUFFERS (The "Ping-Pong")
        std::swap(readBuffer, writeBuffer);
    }
    return 0;
}
