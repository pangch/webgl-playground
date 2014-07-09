define(['gl-matrix'], function(glm) {
  
  // A plane is represented by equation from three points on the plane:
  //   vecA * x + vecB * x + vecC * z + D = 0
  //
  // Normal vector of the plane:
  //   vecN = normalize((vecB - vecA) X (vecC - vecA))
  // Then D in the equation becomes:
  //   D = -vecN dot vecA
  // Distance of any point to the plane d is then:
  //   d = vecN dot vecQ + D
  
  var Plane = function(normal, d) {
    this.normal = normal;
    this.d = d;
  };
  
  Plane.fromVetices = function(vecA, vecB, vecC) {
    var vec1 = glm.vec3.create(), vec2 = glm.vec3.create();
    glm.vec3.sub(vec1, vecB, vecA);
    glm.vec3.sub(vec2, vecC, vecA);
    var vecN = glm.vec3.create();
    glm.vec3.cross(vecN, vec1, vec2);
    glm.vec3.normalize(vecN, vecN);
    
    return new Plane(vecN, -glm.vec3.dot(vecN, vecA));
  }
  
  return Plane;
});