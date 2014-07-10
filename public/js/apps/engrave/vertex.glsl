attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec4 vColor;
varying vec3 vNormal;

void main(void) {
  vNormal = uNMatrix * aVertexNormal;
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vColor = aVertexColor;
}