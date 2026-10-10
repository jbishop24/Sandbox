#include <SFML/Graphics.hpp>
#include <SFML/OpenGL.hpp>

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Sandbox");
    window.setFramerateLimit(240);

    sf::RenderTexture bufferA, bufferB;
    bufferA.create(800, 600);
    bufferB.create(800, 600);
    bufferA.setSmooth(false);
    bufferB.setSmooth(false);
    bufferA.clear(sf::Color::Black);
    bufferB.clear(sf::Color::Black);

    sf::RenderTexture* readBuffer  = &bufferA;
    sf::RenderTexture* writeBuffer = &bufferB;

    sf::Shader simShader;
    simShader.loadFromFile("/home/jon/Sandbox/test.frag", sf::Shader::Fragment);
    sf::RenderStates simStates;
    simStates.shader = &simShader;
    simStates.blendMode = sf::BlendNone;
    sf::Sprite simSprite;

    sf::Shader vizShader;
    vizShader.loadFromFile("/home/jon/Sandbox/viz.frag", sf::Shader::Fragment);
    sf::RenderStates vizStates;
    vizStates.shader = &vizShader;
    vizStates.blendMode = sf::BlendNone;
    sf::Sprite vizSprite;

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

        sf::Vector2i mousePos = sf::Mouse::getPosition(window);
        bool isLeftPressed = sf::Mouse::isButtonPressed(sf::Mouse::Left);

        simShader.setUniform("u_texture", readBuffer->getTexture());
        simShader.setUniform("u_resolution", sf::Glsl::Vec2(800.0, 600.0));
        simShader.setUniform("u_mouse", sf::Glsl::Vec2(mousePos.x, 600.0f - mousePos.y));
        simShader.setUniform("u_mouse_pressed", isLeftPressed ? 1.0f : 0.0f);
        simSprite.setTexture(readBuffer->getTexture());
        writeBuffer->clear();
        writeBuffer->draw(simSprite, simStates);
        writeBuffer->display();

        vizShader.setUniform("u_texture", writeBuffer->getTexture());
        vizShader.setUniform("u_resolution", sf::Glsl::Vec2(800.0, 600.0));
        vizSprite.setTexture(writeBuffer->getTexture());
        window.clear();
        window.draw(vizSprite, vizStates);
        window.display();

        std::swap(readBuffer, writeBuffer);
    }
    return 0;
}
