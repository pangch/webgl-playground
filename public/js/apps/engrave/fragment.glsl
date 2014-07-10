precision mediump float;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

uniform bool uUseLighting;

uniform vec3 uAmbientColor;
uniform vec3 uPointLightingPosition;
uniform vec3 uPointLightingColor;

void main(void) {
  vec3 lightWeighting;
  
  if (!uUseLighting) {
    lightWeighting = vec3(1.0, 1.0, 1.0);
  } else {
    vec3 lightVec = uPointLightingPosition - vPosition.xyz;
    vec3 lightDirection = normalize(lightVec);
    
    lightWeighting = uAmbientColor + uPointLightingColor * max(dot(vNormal, lightDirection), 0.0);
  }
  gl_FragColor = vec4(vColor.rgb * lightWeighting, vColor.a);
}