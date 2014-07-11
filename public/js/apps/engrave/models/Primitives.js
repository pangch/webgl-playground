define(['./Polygon', './Solid', 'gl-matrix'], function(Polygon, Solid, glm) {
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
      var polygons = [
            Polygon.fromVertices([verts[4], verts[5], verts[6], verts[7]]),
            Polygon.fromVertices([verts[5], verts[1], verts[2], verts[6]]),
            Polygon.fromVertices([verts[1], verts[0], verts[3], verts[2]]),
            Polygon.fromVertices([verts[0], verts[4], verts[7], verts[3]]),
            Polygon.fromVertices([verts[7], verts[6], verts[2], verts[3]]),
            Polygon.fromVertices([verts[4], verts[0], verts[1], verts[5]]),
            ];
      return Solid.fromPolygons(polygons);
    },
    
    cube: function(origin, length) {
      return this.cuboid(origin, length, length, length);
    },
    
    prism: function(polygon, height) {
      var polygons = [polygon];
      var normal = polygon.plane.normal;      
      var shift = glm.vec3.scale(glm.vec3.create(), normal, -height);
      
      // The other base      
      polygons.push(polygon.translate(shift).flip());
      
      // All sides
      var vertices = polygon.vertices;
      for (var i = 0; i < vertices.length; i++) {
        var nextIndex = i + 1;
        if (nextIndex == vertices.length) {
          nextIndex = 0;
        }
        
        var current = vertices[i];
        var next = vertices[nextIndex];
        polygons.push(Polygon.fromVertices([
          next,
          current, 
          glm.vec3.add(glm.vec3.create(), current, shift),
          glm.vec3.add(glm.vec3.create(), next, shift)
        ]));        
      }
      
      return Solid.fromPolygons(polygons);
    }
  }
});