define(['./assets'], function(assets) {
  
  var addCube = function(gl, objects, color, indexBase, objectIndex) {  
    var addFace = function(vertices, normals) {
      Array.prototype.push.apply(objects.vertices, vertices);
      Array.prototype.push.apply(objects.normals, normals);
      for (var i = 0; i < 4; i++) {
        Array.prototype.push.apply(objects.colors, color);
      }
      objects.objectIndices.push(objectIndex, objectIndex, objectIndex, objectIndex);
      objects.indices.push(indexBase, indexBase + 1, indexBase + 2, indexBase, indexBase + 2, indexBase + 3);
      indexBase += 4;
    }
    
    addFace([
        -0.5, -0.5, 0.5, 
        0.5, -0.5, 0.5, 
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5
    ], [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ]);
    
    addFace([
        0.5, -0.5, 0.5, 
        0.5, -0.5, -0.5, 
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5
    ], [
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0
    ]);
    
    addFace([
        0.5, -0.5, -0.5, 
        -0.5, -0.5, -0.5, 
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5
    ], [
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0
    ]);
    
    addFace([
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5, 
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5
    ], [
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ]);
    
    addFace([
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5
    ], [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ]);
    
    addFace([
        -0.5, -0.5, 0.5, 
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5
    ], [
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0
    ]);
    
    return indexBase;
  };
  
  var sphere;
  var initSphere = function(level, radius) {
    var vertexPositionData = [];
    var normalData = [];
    for (var latNumber = 0; latNumber <= level; latNumber++) {
      var theta = latNumber * Math.PI / level;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= level; longNumber++) {
        var phi = longNumber * 2 * Math.PI / level;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / level);
        var v = 1 - (latNumber / level);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }      
    }
    
    var indexData = [];
    for (var latNumber = 0; latNumber < level; latNumber++) {
      for (var longNumber = 0; longNumber < level; longNumber++) {
        var first = (latNumber * (level + 1)) + longNumber;
        var second = first + level + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }
    
    sphere = {
      vertices: vertexPositionData,
      normals: normalData,
      indices: indexData,
      vertexCount: vertexPositionData.length / 3
    }
  };
  
  var addSphere = function(gl, objects, color, indexBase, objectIndexX, objectIndexY) {
    Array.prototype.push.apply(objects.vertices, sphere.vertices);
    Array.prototype.push.apply(objects.normals, sphere.normals);
    Array.prototype.push.apply(objects.indices, sphere.indices.map(function(index) { return indexBase + index }));
    
    for (var i = 0; i < sphere.vertexCount; i++) {
      Array.prototype.push.apply(objects.colors, color);
      
      objects.objectIndices.push(objectIndexX, objectIndexY);
    }
    
    indexBase += sphere.vertexCount;
    return indexBase;
  };
  
  // Create an object of GL array buffers from a model
  var buildObjects = function(gl, objects) {
    var obj = {};
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.vertices), gl.STATIC_DRAW);
    obj.vertices = buffer;
    obj.vertexCount = objects.vertices.length / 3;
    
    if (objects.normals) {
      var normalsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.normals), gl.STATIC_DRAW);
      obj.normals = normalsBuffer;
    }
    
    if (objects.colors) {
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.colors), gl.STATIC_DRAW);
      obj.colors = colorBuffer;
    }
    
    if (objects.objectIndices) {
      var objectIndicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, objectIndicesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.objectIndices), gl.STATIC_DRAW);
      obj.objectIndices = objectIndicesBuffer;
    }
    
    if (objects.indices) {
      var indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objects.indices), gl.STATIC_DRAW);
      obj.indices = indicesBuffer;
      obj.indexCount = objects.indices.length;
    }
    
    return obj;      
  }
  
  return {
    init: function(gl, gridSize) {
      var objects = {};
      objects.vertices = [];
      objects.normals = [];
      objects.colors = [];
      objects.indices = [];
      objects.objectIndices = [];
      
      var colors = [
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.4, 0.8, 0.6, 1.0],
        [0.6, 0.4, 0.8, 1.0],
        [0.8, 0.6, 0.4, 1.0]
      ];
      
      initSphere(10, 1.0);
      var indexBase = 0;      
      for (var i = 0; i < gridSize * gridSize - 1; i++) {
        // indexBase = addCube(gl, objects, colors[i % colors.length], indexBase, i);
        var color = colors[i % colors.length];
        var index = i + 1;
        var x = (index % gridSize) / gridSize, y = Math.floor(index / gridSize) / gridSize;
        if (i == 0) {
          color = [1.0, 1.0, 1.0, 1.0];
        }
        indexBase = addSphere(gl, objects, color , indexBase, x, y);
      }

      this.objects = buildObjects(gl, objects);
      this.objects.objectGridSize = gridSize;
    },
    
    draw: function(gl, shader) {
      var objects = this.objects;

      gl.bindBuffer(gl.ARRAY_BUFFER, objects.vertices);
      gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, objects.normals);
      gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, objects.colors);
      gl.vertexAttribPointer(shader.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, objects.objectIndices);
      gl.vertexAttribPointer(shader.objectIndexAttribute, 2, gl.FLOAT, false, 0, 0);
    
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objects.indices);
      gl.drawElements(gl.TRIANGLES, objects.indexCount, gl.UNSIGNED_SHORT, 0);
    }
  };
});