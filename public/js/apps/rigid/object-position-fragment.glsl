precision mediump float;

#define M_PI 3.1415926535897932384626433832795

uniform int uObjectMapSize;
varying vec2 vPosition;

uniform sampler2D uObjectPositionMap; // Old positions
uniform sampler2D uObjectVelocityMap; // Old velocity

// Convert from [-1, 1] to [0, 1]
vec2 toTexCoord(vec2 vPosition) {
  return (vPosition + 1.0) * 0.5;
}

void main(void) {
  vec2 posIndex = toTexCoord(vPosition);
  
  vec3 pos = texture2D(uObjectPositionMap, posIndex).xyz;
  vec3 velocity = texture2D(uObjectVelocityMap, posIndex).xyz;
  
  pos += velocity;
  gl_FragColor = vec4(pos, 1.0);
}