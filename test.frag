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

vec4 packFloat(float value) {
    vec4 c;
    float v = 10000.0 * value;
    c.r = floor(v) / 10000.0;
    v -= 10000.0 * c.r;
    c.g = floor(v) / 100.0;
    v -= 100 * c.g;
    c.b = v;
    c.a = 1.0;
    return c;
}

float unpackFloat(vec4 c) {
    return (10000.0 * c.r + 100* c.g + c.b) / 10000.0;
}

float getValue(vec2 uv) {
    return unpackFloat(texture2D(u_texture, uv));
}

void main() {
    float d = distance(gl_FragCoord.xy, u_mouse);
    if (u_mouse_pressed > 0.5 && d < 10.0) {
        FragColor = packFloat(1.0);
        return;
    }
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1.0 / u_resolution;
    vec2 dx = vec2(texel.y, 0.0);
    vec2 dy = vec2(0.0, texel.y);
    float cc = getValue(uv);
    float uc = getValue(uv + dy);
    float dc = getValue(uv - dy);
    float lc = getValue(uv - dx);
    float rc = getValue(uv + dx);
    float dt = .25;
    FragColor = packFloat(cc + dt * (uc + dc + lc + rc - 4.0 * cc));
}
