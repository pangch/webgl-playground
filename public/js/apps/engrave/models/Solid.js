define(['./BSPTree', 'gl-matrix'], function(BSPTree, glm) {
  var Solid = function(bsp) {
    this.bsp = bsp;
    bsp.buildAllPolygonsIfNeeded();
    
    this.polygons = bsp.allPolygons;
    console.log("Output Polygons: ");
    for(var i = 0; i < this.polygons.length; i++) {
      this.polygons[i].print();
    }
  };
  
  Solid.fromPolygons = function(polygons) {    
    console.log("Input Polygons: ");
    for(var i = 0; i < polygons.length; i++) {
      polygons[i].print();
    }
    return new Solid(BSPTree.fromPolygons(polygons));
  }
  
  Solid.prototype = {
    toTriangleList: function() {
      var vertexList = [], normalList = [], indexList = [];
      for (var i = 0; i < this.polygons.length; i++) {
        var triangles = this.polygons[i].toTriangleList(vertexList.length / 3);
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
      var model = this.toTriangleList();
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
      gl.vertexAttrib4f(shader.vertexColorAttribute, 0.1, 1.0, 1.0, 1.0);
      
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
      gl.drawElements(gl.TRIANGLES, this.buffers.indexCount, gl.UNSIGNED_SHORT, 0);
      
      gl.enableVertexAttribArray(shader.vertexColorAttribute);
    }
  }
  
  return Solid;
});