attribute vec3 aVertexPosition;

varying vec4 vPosition;

void main(void) {
  vPosition = vec4(aVertexPosition, 1.0);
  gl_Position = vPosition;
}