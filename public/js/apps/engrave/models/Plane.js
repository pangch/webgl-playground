define(['gl-matrix'], function(glm) {
  
  // A plane is represented by equation from three points on the plane:
  //   Ax + Bx + Cz + d = 0
  //
  // Normal vector of the plane:
  //   N = normalize((B - A) cross (C - A))
  // Then d in the equation becomes:
  //   d = -N dot A
  // Signed distance of any point P to the plane d is then:
  //   dist = N dot P + d
  
  var Plane = function(normal, d) {
    this.normal = normal;
    this.d = d;
  };
  
  Plane.fromPoints = function(vecA, vecB, vecC) {
    var vec1 = glm.vec3.sub(glm.vec3.create(), vecB, vecA);
    var vec2 = glm.vec3.sub(glm.vec3.create(), vecC, vecA);    
    var vecN = glm.vec3.cross(glm.vec3.create(), vec1, vec2);
    glm.vec3.normalize(vecN, vecN);
    
    return new Plane(vecN, -glm.vec3.dot(vecN, vecA));
  }
  
  Plane.prototype = {
    distToPoint: function(vec) {
      // Returns *signed* distance: N dot P + d
      return glm.vec3.dot(this.normal, vec) + this.d;
    },
    flip: function() {
      return new Plane(glm.vec3.negate(glm.vec3.create(), this.normal), this.d);
    }
  }
  
  return Plane;
});