precision mediump float;

varying vec3 vNormal;
varying vec4 vColor;

uniform bool uUseLighting;

uniform vec3 uAmbientColor;
uniform vec3 uPointLightingDirection;
uniform vec3 uPointLightingColor;

void main(void) {
  vec3 lightWeighting;
  
  if (!uUseLighting) {
    lightWeighting = vec3(1.0, 1.0, 1.0);
  } else {
    lightWeighting = uAmbientColor + uPointLightingColor * max(dot(vNormal, uPointLightingDirection), 0.0);
  }
  gl_FragColor = vec4(vColor.rgb * lightWeighting, vColor.a);
}