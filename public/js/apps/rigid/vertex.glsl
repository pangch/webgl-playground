attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

attribute vec2 aObjectIndex;
uniform int uObjectGridSize;

uniform sampler2D uObjectMap;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vPosition;

void main(void) {
  vNormal = uNMatrix * aVertexNormal;
  if (uObjectGridSize < 0) {
    vColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
  vec4 objectPos = texture2D(uObjectMap, aObjectIndex);
  vPosition = uMVMatrix * vec4(aVertexPosition + objectPos.xyz, 1.0);
  gl_Position = uPMatrix * vPosition;
  
  vColor = aVertexColor;
}