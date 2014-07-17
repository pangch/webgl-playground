precision mediump float;

uniform int uSpaceGridSize;
uniform int uSpaceGridBlockSize;
uniform float uSpaceGridTextureSizeInverse;

varying vec2 vPosition;

uniform sampler2D uSpaceGrid;

uniform sampler2D uObjectPositionMap; // Old positions
uniform sampler2D uObjectVelocityMap; // Old velocity

#define COLLISION_DIST 3.0
#define COLLISION_DECAY 0.99
#define BOUNCE_DIST 1.0
#define BOUNCE_DECAY 0.8
#define FRICTION_MULTIPLIER -0.02
#define GRAVITY 0.006

#define WALL_DIST 100.0

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
    
    if (distance(position, neighborPosition) < COLLISION_DIST) {
      // Real collision
      vec3 neighborVelocity = texture2D(uObjectVelocityMap, neighborIndex.xy).xyz;
      
      vec3 relativeVelocity = neighborVelocity - velocity;
      vec3 relativePosition = position - neighborPosition;
      // Detect if they are on a collision course
      if (dot(relativeVelocity, relativePosition) > 0.0) {
        // Assuming the mass of all objects are the same. 
        // After collision they exchange velocity.
        force += relativeVelocity * COLLISION_DECAY;
      }      
    }
  }
  
}

void bounce(vec3 position, float dist, vec3 velocity, vec3 normal, vec3 forceAdjustment, inout vec3 force) {
  if (dist > BOUNCE_DIST) {
    // Too far
    return;
  }
  
  if (dot(velocity, normal) > 0.0) {
    // Already bounced
    return;
  }
  
  force += -2.0 * BOUNCE_DECAY * abs(normal) * velocity;
  force += forceAdjustment;
}

void main(void) {
  vec2 posIndex = toTexCoord(vPosition);
  
  vec3 position = texture2D(uObjectPositionMap, posIndex).xyz;
  vec3 velocity = texture2D(uObjectVelocityMap, posIndex).xyz;
  
  vec3 force = vec3(0.0, 0.0, -GRAVITY);
  
  // Collision
  ivec3 iPosition = ivec3(position);
  for (int i = -3; i <= 3; i++) {
    for (int j = -3; j <= 3; j++) {
      for (int k = -3; k <= 3; k++) {
        if (i != 0 || j != 0 || k != 0) {
          collision(position, iPosition + ivec3(i, j, k), velocity, force);          
        }
      }
    }
  }
  
  // Bounce
  bounce(position, position.x, velocity, vec3(1.0, 0.0, 0.0), vec3(0.0), force);
  bounce(position, position.y, velocity, vec3(0.0, 1.0, 0.0), vec3(0.0), force);
  bounce(position, position.z, velocity, vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, GRAVITY), force);
  bounce(position, WALL_DIST - position.x, velocity, vec3(-1.0, 0.0, 0.0), vec3(0.0), force);
  bounce(position, WALL_DIST - position.y, velocity, vec3(0.0, -1.0, 0.0), vec3(0.0), force);
  bounce(position, WALL_DIST - position.z, velocity, vec3(0.0, 0.0, -1.0), vec3(0.0), force);
    
  // Friction
  if (position.z < 1.0 && abs(velocity.z) < 0.01) {
    force += FRICTION_MULTIPLIER * velocity;
  }
        
  velocity += force;  
  gl_FragColor = vec4(velocity, 1.0);
}