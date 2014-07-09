define(['gl-matrix'], function(glm) {
  return {
    toInverseMat3: function(mat, dest) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2];
      var a10 = mat[4], a11 = mat[5], a12 = mat[6];
      var a20 = mat[8], a21 = mat[9], a22 = mat[10];
  
      var b01 = a22*a11-a12*a21;
      var b11 = -a22*a10+a12*a20;
      var b21 = a21*a10-a11*a20;
          
      var d = a00*b01 + a01*b11 + a02*b21;
      if (!d) { return null; }
      var id = 1/d;
  
      if(!dest) { dest = glm.mat3.create(); }
  
      dest[0] = b01*id;
      dest[1] = (-a22*a01 + a02*a21)*id;
      dest[2] = (a12*a01 - a02*a11)*id;
      dest[3] = b11*id;
      dest[4] = (a22*a00 - a02*a20)*id;
      dest[5] = (-a12*a00 + a02*a10)*id;
      dest[6] = b21*id;
      dest[7] = (-a21*a00 + a01*a20)*id;
      dest[8] = (a11*a00 - a01*a10)*id;
  
      return dest;
    }
  };
});