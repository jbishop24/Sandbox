#version 130

uniform sampler2D u_texture;   // Our Ping-Pong read buffer
uniform vec2 u_resolution;    // Window size (e.g., 800x600)
uniform vec2 u_mouse;         // Screen space mouse coords
uniform float u_mouse_pressed;// 1.0 if clicked, 0.0 otherwise
uniform float u_time;         // Time tracker for dynamic injection

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1.0 / u_resolution;

    // --- STEP 1: READ PREVIOUS FRAME STATE ---
    // Red = Velocity X, Green = Velocity Y, Blue = Dye/Color Density
    vec4 currentState = texture2D(u_texture, uv);
    vec2 velocity = currentState.xy;
    float dye = currentState.z;

    // --- STEP 2: ADVECTION (Move fluid along its own velocity field) ---
    // Look backward in time along the velocity vector to see what should move here
    vec2 advectedUV = uv - (velocity * 0.016); // 0.016 is dt (approx 60fps)
    vec4 advectedState = texture2D(u_texture, advectedUV);

    // Smoothly decay velocity and dye over time so it doesn't swirl infinitely
    velocity = advectedState.xy * 0.995;
    float nextDye = advectedState.z * 0.991;

    // --- STEP 3: DIFFUSION / NEIGHBOR PRESSURE BALANCE ---
    // Sample 4 cardinal neighbors to calculate local pressure differentials
    vec4 left  = texture2D(u_texture, uv + vec2(-texel.x, 0.0));
    vec4 right = texture2D(u_texture, uv + vec2( texel.x, 0.0));
    vec4 down  = texture2D(u_texture, uv + vec2(0.0, -texel.y));
    vec4 up    = texture2D(u_texture, uv + vec2(0.0,  texel.y));

    // Calculate fluid divergence (is water squeezing in or spreading out?)
    float divergence = ((right.x - left.x) + (up.y - down.y)) * 0.5;

    // Modify velocity vector to push back against extreme divergence centers
    velocity.x -= (right.z - left.z) * 0.1;
    velocity.y -= (up.z - down.z) * 0.1;

    // --- STEP 4: MOUSE INTERACTION & CONTINUOUS INJECTION ---
    float dist = distance(gl_FragCoord.xy, u_mouse);
    if (u_mouse_pressed > 0.5 && dist < 25.0) {
        // Calculate velocity based on mouse pull direction (center outward)
        vec2 forceDirection = normalize(gl_FragCoord.xy - u_mouse);
        float forceStrength = (1.0 - (dist / 25.0)) * 2.5;

        velocity += forceDirection * forceStrength;
        nextDye += (1.0 - (dist / 25.0)) * 4.0; // Inject heavy ink dye
    }

    // Border constraints: Kill velocities hitting screen walls
    if (uv.x < texel.x || uv.x > 1.0 - texel.x) velocity.x = 0.0;
    if (uv.y < texel.y || uv.y > 1.0 - texel.y) velocity.y = 0.0;

    // Save state back to the write buffer texture
    gl_FragColor = vec4(velocity, nextDye, 1.0);
}
