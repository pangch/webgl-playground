precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uTexture;

void main(void) {
  gl_FragColor = texture2D(uTexture, vec2(vTextureCoord.s, vTextureCoord.t));
}