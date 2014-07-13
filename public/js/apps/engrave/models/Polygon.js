define(['./Plane', 'gl-matrix'], function(Plane, glm) {
  var Polygon = function(vertices) {
    this.vertices = vertices;
    this.plane = Plane.fromPoints(vertices[0], vertices[1], vertices[2]);
  };
  
  // The vertices needs to be coplanar and forming a convex loop
  Polygon.fromVertices = function(vertices) {
    return new Polygon(vertices);    
  };
  
  Polygon.prototype = {
    flip: function() {
      return Polygon.fromVertices(this.vertices.slice().reverse());
    },
    
    translate: function(vec3) {
      return Polygon.fromVertices(this.vertices.map(function(vertex) {
        return [vertex[0] + vec3[0], vertex[1] + vec3[1], vertex[2] + vec3[2]];
      }));
    },
    
    scale: function(vec3) {
      return Polygon.fromVertices(this.vertices.map(function(vertex) {
        return [vertex[0] * vec3[0], vertex[1] * vec3[1], vertex[2] * vec3[2]];
      }));
    },
    
    triangulate: function(indexBase) {
      var vertexList = [], normalList = [], indexList = [];
      var n = this.plane.normal;
      for (var i = 0; i < this.vertices.length; i++) {
        var v = this.vertices[i];
        vertexList.push(v[0], v[1], v[2]);
        normalList.push(n[0], n[1], n[2]);
      }
      for (var i = 0; i < this.vertices.length - 2; i++) {
        indexList.push(indexBase, indexBase + i + 1, indexBase + i + 2);
      }
      return {
        vertices: vertexList,
        normals: normalList,
        indices: indexList
      };
    }
  }
  
  return Polygon;
});