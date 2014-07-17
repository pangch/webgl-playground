precision mediump float;

uniform sampler2D uSpaceGrid;

varying vec2 vPosition;

void main(void) {
  vec3 index = texture2D(uSpaceGrid, vPosition).xyz;
  
  gl_FragColor = vec4(index, 1.0);
}