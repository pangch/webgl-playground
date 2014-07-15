attribute vec3 aVertexPosition;

uniform mat4 uMVPMatrix;
varying vec4 vPosition;

void main(void) {
  vPosition = vec4(aVertexPosition, 1.0);
  gl_Position = uMVPMatrix * vPosition;
}