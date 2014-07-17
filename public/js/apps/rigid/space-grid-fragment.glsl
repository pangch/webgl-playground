precision mediump float;

uniform int uSpaceGridSize;

varying vec2 vIndex;

void main(void) {  
  // Output FragColor.z == 1.0 to denote that the position is occupied by an object
  gl_FragColor = vec4(vIndex.xy, 1.0, 1.0);
}