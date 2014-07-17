attribute vec2 aVertexPosition;

uniform int uSpaceGridSize;
uniform int uSpaceGridBlockSize;
uniform float uSpaceGridTextureSizeInverse;
uniform sampler2D uObjectPositionMap;

varying vec2 vIndex;

// Maps the 3D position to 2D texture coordination  
vec2 toSpaceTexCoord(vec3 pos) {
  int z = int(pos.z);
  int dy = z / uSpaceGridBlockSize;
  int dx = z - dy * uSpaceGridBlockSize;
  
  vec2 coord = vec2(float(int(pos.x)) + float(dx * uSpaceGridSize), float(int(pos.y)) + float(dy * uSpaceGridSize));
  return (coord + 0.5) * uSpaceGridTextureSizeInverse;
}

void main(void) {
  vec2 pos = toSpaceTexCoord(texture2D(uObjectPositionMap, aVertexPosition).xyz);
  
  // Maps the position from range (0..1, 0..1) to range (-1..1, -1..1)
  pos = pos * 2.0 - 1.0;
  
  vIndex = aVertexPosition;
  gl_Position = vec4(pos.xy, 0.0, 1.0);
}