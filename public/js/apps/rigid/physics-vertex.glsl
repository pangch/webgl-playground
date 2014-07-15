attribute vec2 aVertexPosition;

varying vec2 vPosition;

void main(void) {
  vPosition = aVertexPosition;
  gl_Position = vec4(aVertexPosition, 0, 1);
}