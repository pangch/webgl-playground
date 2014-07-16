precision mediump float;

#define RADIUS 0.5

uniform int uSpaceGridSize;
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


void collision(vec3 position, vec3 diff, vec3 velocity, inout vec3 force) {
  vec2 texCoord = toSpaceTexCoord(position + diff);
  if (texCoord.x > 1.0 || texCoord.x < 0.0 || texCoord.y > 1.0 || texCoord.y < 0.0) {
    // Out of bounds of space grid
    return;
  }
  vec3 neighborIndex = texture2D(uSpaceGrid, texCoord).xyz;
  if (neighborIndex.z > 0.9) {
    vec3 neighborPosition = texture2D(uObjectPositionMap, neighborIndex.xy).xyz;
    if (distance(position, neighborPosition) < 2.0 * RADIUS) {
      // Real collision
      vec3 neighborVelocity = texture2D(uObjectVelocityMap, neighborIndex.xy).xyz;
      force += (neighborVelocity - velocity) * 0.99;
    }    
  }
}

void main(void) {
  vec2 posIndex = toTexCoord(vPosition);
  
  vec3 position = texture2D(uObjectPositionMap, posIndex).xyz;
  vec3 velocity = texture2D(uObjectVelocityMap, posIndex).xyz;
  
  vec3 force = vec3(0.0, 0.0, -0.015);
  

  collision(position, vec3(0.0, 0.0, 1.0), velocity, force);
  collision(position, vec3(0.0, 1.0, 0.0), velocity, force);
  collision(position, vec3(1.0, 0.0, 0.0), velocity, force);
  collision(position, vec3(0.0, 0.0, -1.0), velocity, force);
  collision(position, vec3(0.0, -1.0, 0.0), velocity, force);
  collision(position, vec3(-1.0, 0.0, 0.0), velocity, force);
  

  velocity += force;  
  gl_FragColor = vec4(velocity, 1.0);
}