// Falling Sand Snippet
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mouse_pressed;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1.0 / u_resolution;

    // Read current state, directly below, and directly above
    vec4 current = texture2D(u_texture, uv);
    vec4 below   = texture2D(u_texture, uv + vec2(0.0, -texel.y));
    vec4 above   = texture2D(u_texture, uv + vec2(0.0,  texel.y));

    vec4 nextState = current;

    // Physics Rules
    if (current.r > 0.5 && below.g < 0.1) {
        // I am sand, but space below me is empty -> I fall, so this pixel becomes empty
        nextState = vec4(0.0);
    } else if (current.g < 0.1 && above.r > 0.5) {
        // I am empty space, but sand is above me -> It falls into me
        nextState = vec4(1.0, 0.0, 0.0, 1.0); // Turn into sand
    }

    // Paint new sand with mouse
    if (u_mouse_pressed > 0.5 && distance(gl_FragCoord.xy, u_mouse) < 10.0) {
        nextState = vec4(1.0, 0.0, 0.0, 1.0); // Spawn Sand
    }

    gl_FragColor = nextState;
}
