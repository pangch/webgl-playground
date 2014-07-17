precision mediump float;

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

// Maps the 3D position to 2D texture coordination  
vec2 toSpaceTexCoord(ivec3 pos) {
  int z = pos.z;
  int dy = z / uSpaceGridBlockSize;
  int dx = z - dy * uSpaceGridBlockSize;
  
  ivec2 coord = ivec2(pos.x + dx * uSpaceGridSize, pos.y + dy * uSpaceGridSize);
  return (vec2(coord) + 0.5) * uSpaceGridTextureSizeInverse;
}

void collision(vec3 position, ivec3 spacePosition, vec3 velocity, inout vec3 force) {
  vec2 texCoord = toSpaceTexCoord(spacePosition);
  if (texCoord.x > 1.0 || texCoord.x < 0.0 || texCoord.y > 1.0 || texCoord.y < 0.0) {
    // Out of bounds of space grid
    return;
  }
  
  vec3 neighborIndex = texture2D(uSpaceGrid, texCoord).xyz;
  if (neighborIndex.z > 0.0) {
    vec3 neighborPosition = texture2D(uObjectPositionMap, neighborIndex.xy).xyz;
    
    if (distance(position, neighborPosition) < 2.0) {
      // Real collision
      vec3 neighborVelocity = texture2D(uObjectVelocityMap, neighborIndex.xy).xyz;
      
      vec3 relativeVelocity = neighborVelocity - velocity;
      vec3 relativePosition = position - neighborPosition;
      // Detect if they are on a collision course
      if (dot(relativeVelocity, relativePosition) > 0.0) {
        // Assuming the mass of all objects are the same. 
        // After collision they exchange velocity.
        force += relativeVelocity * 0.99;
      }      
    }
  }
  
}

void main(void) {
  vec2 posIndex = toTexCoord(vPosition);
  
  vec3 position = texture2D(uObjectPositionMap, posIndex).xyz;
  vec3 velocity = texture2D(uObjectVelocityMap, posIndex).xyz;
  
  // Test if the space grid has been written correctly
  vec2 texCoord = toSpaceTexCoord(ivec3(position));
  vec3 indexSG = texture2D(uSpaceGrid, texCoord).xyz;
    
  vec3 force = vec3(0.0, 0.0, -0.0006);
  
  ivec3 iPosition = ivec3(position);
  for (int i = -2; i <= 2; i++) {
    for (int j = -2; j <= 2; j++) {
      for (int k = -2; k <= 2; k++) {
        if (i != 0 || j != 0 || k != 0) {
          collision(position, iPosition + ivec3(i, j, k), velocity, force);          
        }
      }
    }
  }
    
  velocity += force;  
  gl_FragColor = vec4(velocity, 1.0);
}