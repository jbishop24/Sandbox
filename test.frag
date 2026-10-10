#version 400
uniform sampler2D u_texture;   // Our Ping-Pong read buffer
uniform vec2 u_resolution;     // Window size (e.g., 800x600)
uniform vec2 u_mouse;          // Screen space mouse coords
uniform float u_mouse_pressed;

out vec4 FragColor;

float m1 = 255.0;
float m2 = m1 * m1;
float m3 = m1 * m1 * m1;

vec4 packFloat(float value) {
    vec4 c;
    float v = m3 * value;
    c.r = floor(v) / m3;
    v -= m3 * c.r;
    c.g = floor(v) / m2;
    v -= m2 * c.g;
    c.b = floor(v) / m1;
    v -= m1 * c.b;
    c.a = v;
    return c;
}

float unpackFloat(vec4 c) {
    return (m3 * c.r + m2 * c.g + m1 * c.b + c.a) / m3;
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
