define(['./Polygon', './Solid'], function(Polygon, Solid) {
  return {
    cuboid: function(origin, lengthX, lengthY, lengthZ) {
      var oX = origin[0], oY = origin[1], oZ = origin[2];
      var nX = oX + lengthX, nY = oY + lengthY, nZ = oZ + lengthZ;
      
      var verts = [
        [oX, oY, oZ],
        [nX, oY, oZ],
        [nX, nY, oZ],
        [oX, nY, oZ],
        [oX, oY, nZ],
        [nX, oY, nZ],
        [nX, nY, nZ],
        [oX, nY, nZ],
      ];
      var poly = [
            Polygon.fromVertices([verts[4], verts[5], verts[6], verts[7]]),
            Polygon.fromVertices([verts[5], verts[1], verts[2], verts[6]]),
            Polygon.fromVertices([verts[1], verts[0], verts[3], verts[2]]),
            Polygon.fromVertices([verts[0], verts[4], verts[7], verts[3]]),
            Polygon.fromVertices([verts[7], verts[6], verts[2], verts[3]]),
            Polygon.fromVertices([verts[4], verts[0], verts[1], verts[5]]),
            ];
      return Solid.fromPolygons(poly);
    },
    
    cube: function(origin, length) {
      return this.cuboid(origin, length, length, length);
    }
  }
});