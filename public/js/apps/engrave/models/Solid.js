define(['./BSPTree', 'gl-matrix'], function(BSPTree, glm) {
  var Solid = function(bsp) {
    this.bsp = bsp;
  };
  
  Solid.fromPolygons = function(polygons) {
    return new Solid(BSPTree.fromPolygons(polygons));
  }
  
  Solid.prototype = {
    polygons: function() {
      return this.bsp.allPolygons();
    },
    
    // Solid A - B:
    // All parts of polygons of A outside B + all parts of polygons of B inside A inverted.
    subtract: function(solid) {      
      var partA = this.bsp.clipInside(solid.bsp);
      var partB = solid.bsp.clipOutside(this.bsp).invert();
      var allPolygons = partA.allPolygons().concat(partB.allPolygons());

      return new Solid(BSPTree.fromPolygons(allPolygons));
    },
    
    // Solid A + B:
    // All parts of polygons of A outside B + all parts of polygons of B outside A
    union: function(solid) {      
      var partA = this.bsp.clipInside(solid.bsp);
      var partB = solid.bsp.clipInside(this.bsp);
      var allPolygons = partA.allPolygons().concat(partB.allPolygons());

      return new Solid(BSPTree.fromPolygons(allPolygons));
    },
    
    // Solid A intersect B
    // All parts of polygons of A inside B + all parts of polygons of B inside A
    intersect: function(solid) {
      var partA = this.bsp.clipOutside(solid.bsp);
      var partB = solid.bsp.clipOutside(this.bsp);
      var allPolygons = partA.allPolygons().concat(partB.allPolygons());

      return new Solid(BSPTree.fromPolygons(allPolygons));      
    },
    
    translate: function(vec3) {
      return Solid.fromPolygons(this.polygons().map(function(polygon) {
        return polygon.translate(vec3);
      }));
    },
    
    triangulate: function() {
      var vertexList = [], normalList = [], indexList = [];
      var polygons = this.polygons();
      for (var i = 0; i < polygons.length; i++) {
        var triangles = polygons[i].triangulate(vertexList.length / 3);
        Array.prototype.push.apply(vertexList, triangles.vertices);
        Array.prototype.push.apply(normalList, triangles.normals);
        Array.prototype.push.apply(indexList, triangles.indices);
      }
      return {
        vertices: vertexList,
        normals: normalList,
        indices: indexList
      };
    },
    
    buildBuffers: function(gl) {
      var model = this.triangulate();
      var obj = {};      

      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
      obj.vertices = buffer;
      obj.vertexCount = model.vertices.length / 3;
      if (model.normals) {
        var normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
        obj.normals = normalsBuffer;
      }
      
      if (model.indices) {
        var indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
        obj.indices = indicesBuffer;
        obj.indexCount = model.indices.length;
      }

      this.buffers = obj;
    },
    
    draw: function(gl, shader) {            
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normals);
      gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
      gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.disableVertexAttribArray(shader.vertexColorAttribute);
      if (typeof this.color === 'undefined') {
        this.color = [0.8, 0.8, 0.8, 1.0];
      }
      gl.vertexAttrib4fv(shader.vertexColorAttribute, this.color);
      
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
      gl.drawElements(gl.TRIANGLES, this.buffers.indexCount, gl.UNSIGNED_SHORT, 0);
      
      gl.enableVertexAttribArray(shader.vertexColorAttribute);
    }
  }
  
  return Solid;
});