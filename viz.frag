#version 400
uniform sampler2D u_texture;
uniform vec2 u_resolution;

out vec4 FragColor;

#if 0
float unpackFloat(vec4 rgba) {
    const vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
    return dot(rgba, bitShift);
}
#else
float unpackFloat(vec4 rgba) {
    return rgba.r;
}
#endif

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 c = texture2D(u_texture, uv);
    float d = unpackFloat(c);
    FragColor = vec4(d, d, d, 1.0);
}
