#version 400


uniform sampler2D u_texture;   // Our Ping-Pong read buffer
uniform vec2 u_resolution;     // Window size (e.g., 800x600)
uniform vec2 u_mouse;          // Screen space mouse coords
uniform float u_mouse_pressed;

out vec4 FragColor;

vec4 red = vec4(1.0,0.0,0.0,1.0);
vec4 green = vec4(0.0,1.0,0.0,1.0);
vec4 yellow = vec4(1.0,1.0,0.0,1.0);
vec4 black = vec4(0.0,0.0,0.0,1.0);
vec4 white = vec4(1.0,1.0,1.0,1.0);

void main() {
    float d = distance(gl_FragCoord.xy, u_mouse);
    if (u_mouse_pressed > 0.5 && d < 10.0) {
        FragColor = white;
        return;
    }
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1.0 / u_resolution;
    vec2 dx = vec2(texel.y, 0.0);
    vec2 dy = vec2(0.0, texel.y);
    vec4 cc = texture2D(u_texture, uv);
    vec4 uc = uv.y > 1.0 - texel.y ? black : texture2D(u_texture, uv + dy);
    vec4 dc = uv.y < texel.y ? black : texture2D(u_texture, uv - dy);
    vec4 lc = uv.x < texel.x ? black : texture2D(u_texture, uv - dx);
    vec4 rc = uv.x > 1.0 - texel.x ? black : texture2D(u_texture, uv + dx);
    float dt = .25;
    FragColor = cc + dt * (uc + dc + lc + rc - 4.0 * cc);
}
