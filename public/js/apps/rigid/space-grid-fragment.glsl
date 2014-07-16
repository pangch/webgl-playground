precision mediump float;

uniform int uSpaceGridSize;

varying vec2 vIndex;

void main(void) {  
  gl_FragColor = vec4(vIndex.xy, 1.0, 1.0);
}