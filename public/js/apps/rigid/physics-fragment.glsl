precision mediump float;

#define M_PI 3.1415926535897932384626433832795

uniform int uObjectGridSize;

varying vec4 vPosition;

void main(void) {
  float theta = 24.0 * vPosition.x * M_PI / float(uObjectGridSize);
  float x = 10.0 * cos(theta);
  float y = 10.0 * sin(theta);
  
  gl_FragColor = vec4(x, y, 0.0, 1.0);
}