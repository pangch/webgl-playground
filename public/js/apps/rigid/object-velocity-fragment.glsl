precision mediump float;

#define M_PI 3.1415926535897932384626433832795

uniform int uSpaceGridBlockSize;
uniform float uSpaceGridTextureSizeInverse;

varying vec2 vPosition;

uniform sampler2D uSpaceGrid;

uniform sampler2D uObjectPositionMap; // Old positions
uniform sampler2D uObjectVelocityMap; // Old velocity

// Convert from [-1, 1] to [0, 1]
vec2 toTexCoord(vec2 vPosition) {
  return (vPosition + 1.0) * 0.5;
}

// Convert from position to texture coordinate of the space grid
vec2 toSpaceTexCoord(vec3 pos) {
  // Maps the 3D position to 2D texture coordination  
  int z = int(pos.z);
  int dy = z / uSpaceGridBlockSize;
  int dx = z - dy * uSpaceGridBlockSize;
  return vec2(pos.x + float(dx * uSpaceGridBlockSize), pos.y + float(dy * uSpaceGridBlockSize)) * uSpaceGridTextureSizeInverse;
}

void bounce(in float border, inout float position) {
  position = border;
}

void main(void) {
  vec2 posIndex = toTexCoord(vPosition);
  
  vec3 position = texture2D(uObjectPositionMap, posIndex).xyz;
  vec3 velocity = texture2D(uObjectVelocityMap, posIndex).xyz;
  
  vec3 force = vec3(0.0, 0.0, -0.15);
  

  velocity += force;  
  gl_FragColor = vec4(velocity, 1.0);
}