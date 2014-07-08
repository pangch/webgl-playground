precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vPosition;

uniform bool uUseLighting;

uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingColor;
uniform vec3 uPointLightingDirection;

uniform sampler2D uTexture;

void main(void) {
  vec3 lightWeighting;
  
  if (!uUseLighting) {
      lightWeighting = vec3(1.0, 1.0, 1.0);
  } else {
      vec3 lightVec = uPointLightingLocation - vPosition.xyz;
      vec3 lightDirection = normalize(lightVec);
      
      float lightDistanceWeighting = min(pow(1.0 / length(lightVec), 2.0) * 5.0, 1.2);
      float directionalLightWeighting = pow(max(dot(normalize(vNormal), lightDirection), 0.0), 3.0);
      float lightFocusWeighting = pow(max(dot(-lightDirection, uPointLightingDirection), 0.0), 3.0);
      lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting * lightFocusWeighting * lightDistanceWeighting;
  }
  
  vec4 fragmentColor = texture2D(uTexture, vec2(vTextureCoord.s, vTextureCoord.t));
  gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}