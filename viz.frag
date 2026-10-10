#version 400
uniform sampler2D u_texture;
uniform vec2 u_resolution;

out vec4 FragColor;

vec4 getColor(vec4 c) {
    return c;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 c = texture2D(u_texture, uv);
    FragColor = getColor(c);
}
