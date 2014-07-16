attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
  gl_PointSize = 4.0;
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}