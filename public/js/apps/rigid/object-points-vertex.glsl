attribute vec2 aVertexPosition;

uniform int uSpaceGridBlockSize;
uniform float uSpaceGridTextureSizeInverse;
uniform sampler2D uObjectPositionMap;

varying vec2 vIndex;

vec2 toTexCoord(vec3 pos) {
  // Maps the 3D position to 2D texture coordination  
  int z = int(pos.z);
  int dy = z / uSpaceGridBlockSize;
  int dx = z - dy * uSpaceGridBlockSize;
  return vec2(pos.x + float(dx * uSpaceGridBlockSize), pos.y + float(dy * uSpaceGridBlockSize)) * uSpaceGridTextureSizeInverse;
}

void main(void) {
  vec2 pos = toTexCoord(texture2D(uObjectPositionMap, aVertexPosition).xyz);
  
  // Maps the position from range (0..1, 0..1) to range (-1..1, -1..1)
  pos = pos * 2.0 - 1.0;
  
  vIndex = aVertexPosition;
  gl_Position = vec4(pos.xy, 0.0, 1.0);
}