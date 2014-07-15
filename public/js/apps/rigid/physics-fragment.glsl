precision mediump float;

#define M_PI 3.1415926535897932384626433832795

varying vec4 vPosition;

void main(void) {
  float i = vPosition.y * 4.0 + vPosition.x;
  float theta = 2.0 * i * M_PI / 16.0;
  float x = 10.0 * cos(theta);
  float y = 10.0 * sin(theta);
  gl_FragColor = vec4(x, y, 0.0, 1.0);
}