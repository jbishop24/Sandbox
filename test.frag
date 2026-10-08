#version 400


uniform sampler2D u_texture;   // Our Ping-Pong read buffer
uniform vec2 u_resolution;     // Window size (e.g., 800x600)
uniform vec2 u_mouse;          // Screen space mouse coords
uniform float u_mouse_pressed;

out vec4 FragColor;

vec4 on = vec4(1.0,0.0,0.0,1.0);
vec4 off = vec4(0.0,0.0,0.0,1.0);

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float d = distance(gl_FragCoord.xy, u_mouse);
    if (u_mouse_pressed > 0.5 && d < 4.0) {
        FragColor = on;
        return;
    }
    vec4 cc = texture2D(u_texture, uv);
    FragColor = cc;
}
