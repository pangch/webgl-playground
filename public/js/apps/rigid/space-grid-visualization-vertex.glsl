attribute vec2 aVertexPosition;

varying vec2 vPosition;

void main(void) {
  vec2 pos = aVertexPosition.xy;
  vPosition = (pos + 1.0) * 0.5;  
  gl_Position = vec4(aVertexPosition.xy, 0.0, 1.0);
}