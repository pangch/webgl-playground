precision mediump float;

#define M_PI 3.1415926535897932384626433832795

uniform int uGridSize;
varying vec2 vPosition;

void main(void) {
  float pixelSize = float(uGridSize) / 2.0;
  vec2 pos = (vPosition + 1.0) * (float(uGridSize) / 2.0) - 0.5;
  
  float i = pos.y * 4.0 + pos.x;
  float theta = 2.0 * i * M_PI / 16.0;
  
  float x = 10.0 * cos(theta);
  float y = 10.0 * sin(theta);
  
  gl_FragColor = vec4(x, y, 0.0, 1.0);
}