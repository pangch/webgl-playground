attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

attribute vec2 aObjectIndex;

uniform bool uDrawingObjects;

uniform sampler2D uObjectPositionMap;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vPosition;

void main(void) {
  vNormal = uNMatrix * aVertexNormal;
  vec3 objectPos = uDrawingObjects ? texture2D(uObjectPositionMap, aObjectIndex).xyz : vec3(0.0);
  vPosition = uMVMatrix * vec4(aVertexPosition + objectPos, 1.0);
  gl_Position = uPMatrix * vPosition;
  
  vColor = aVertexColor;
}