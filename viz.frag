#version 400
uniform sampler2D u_texture;
uniform vec2 u_resolution;

out vec4 FragColor;

float unpackFloat(vec4 c) {
    return (10000.0 * c.r + 100 * c.g + c.b) / 10000.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 c = texture2D(u_texture, uv);
    float d = unpackFloat(c);
    FragColor = vec4(vec3(d), 1.0);
}
