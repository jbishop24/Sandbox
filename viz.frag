#version 400
uniform sampler2D u_texture;
uniform vec2 u_resolution;

out vec4 FragColor;

float m1 = 255.0;
float m2 = m1 * m1;
float m3 = m1 * m1 * m1;

float unpackFloat(vec4 c) {
    return (m3 * c.r + m2 * c.g + m1 * c.b + c.a) / m3;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 c = texture2D(u_texture, uv);
    float d = unpackFloat(c);
    FragColor = vec4(vec3(d), 1.0);
}
