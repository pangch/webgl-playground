define(['./assets'], function(assets) {
  
  var sphereRadius = 1.0;
  
  var addCube = function(objects, color, indexBase, objectIndex) {  
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
  
  var addSphere = function(objects, color, indexBase, objectIndexX, objectIndexY) {
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
  
  var createObjects = function(objectMapSize) {
    var objects = {};
    objects.vertices = [];
    objects.normals = [];
    objects.colors = [];
    objects.indices = [];
    objects.objectIndices = [];
    
    var colors = [
      [1.0, 0.1, 0.1, 1.0],
      [0.1, 1.0, 0.1, 1.0],
      [0.1, 0.1, 1.0, 1.0],
      [0.1, 1.0, 1.0, 1.0],
      [1.0, 0.1, 1.0, 1.0],
      [1.0, 1.0, 0.1, 1.0],
      [0.4, 0.9, 0.6, 1.0],
      [0.6, 0.4, 0.9, 1.0],
      [0.9, 0.6, 0.4, 1.0],
      [0.3, 0.5, 1.0, 1.0],
      [0.5, 1.0, 0.3, 1.0],
      [1.0, 0.3, 0.5, 1.0],
      [0.3, 0.3, 0.7, 1.0],
      [0.3, 0.7, 0.3, 1.0],
      [0.7, 0.3, 0.3, 1.0],
      [1.0, 0.7, 0.3, 1.0],
      [0.7, 0.3, 1.0, 1.0],
      [0.3, 1.0, 0.7, 1.0]
    ];
    
    initSphere(10, sphereRadius);
    var indexBase = 0;      
    for (var i = 0; i < objectMapSize; i++) {
      for (var j = 0; j < objectMapSize; j++) {
        // indexBase = addCube(gl, objects, colors[i % colors.length], indexBase, i);
        var color = colors[(i * objectMapSize + j) % colors.length];
        indexBase = addSphere(objects, color , indexBase, i / objectMapSize, j / objectMapSize);
      }      
    }
    
    return objects;    
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
      var axisNormalsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, axisNormalsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.normals), gl.STATIC_DRAW);
      obj.normals = axisNormalsBuffer;
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
  
  var axisVerticesBuffer, axisNormalsBuffer, axisColorsBuffer;
  
  var WALL_DIST = 72;
  var initAxis = function(gl) {
    var vertices = [
        0.0,   0.0,   0.0,
      500.0,   0.0,   0.0,
        0.0,   0.0,   0.0,
        0.0, 500.0,   0.0,
        0.0,   0.0,   0.0,
        0.0,   0.0, 500.0,
       72.0,   0.0,   0.0,
       72.0,  72.0,   0.0,
        0.0,  72.0,   0.0,
       72.0,  72.0,   0.0
    ];
  
    axisVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    var normals = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
    ];
  
    axisNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        
    var colors = [
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0
    ];
  
    axisColorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisColorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);    
  };
  
  
  var gridVerticesBuffer, gridNormalsBuffer, gridColorsBuffer;
  
  var initGrid = function(gl) {
    var vertices = [];
    
    var gridSize = 36;
    var limit = gridSize * 10;
    for (var i = -10; i <= 10; i++) {
      var pos = i * gridSize;
      vertices.push(pos, limit, 0.0, pos, -limit, 0.0);
    }
    
    for (var i = -10; i <= 10; i++) {
      var pos = i * gridSize;
      vertices.push(limit, pos, 0.0, -limit, pos, 0.0);
    }
    
    gridVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    var normals = [];
    for (var i = 0; i < 84; i++) {
      normals.push(0.0, 0.0, 1.0);
    }
  
    gridNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        
    var colors = [];
    for (var i = 0; i < 84; i++) {
      colors.push(0.1, 0.1, 0.1, 0.1);
    }
  
    gridColorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridColorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);    
  };
  
  return {
    init: function(gl, objectPositionProgram) {
      var objects = createObjects(objectPositionProgram);
      this.objects = buildObjects(gl, objects);
      this.objects.objectMapSize = objectPositionProgram;
      
      initAxis(gl);
      initGrid(gl);
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
    },
    
    drawAxis: function(gl, shader) {
      gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticesBuffer);
      gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, axisNormalsBuffer);
      gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, axisColorsBuffer);
      gl.vertexAttribPointer(shader.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
      
      gl.disableVertexAttribArray(shader.objectIndexAttribute);
      gl.vertexAttrib2f(shader.objectIndexAttribute, 0.0, 0.0);
            
      gl.lineWidth(2.0);
      gl.drawArrays(gl.LINES, 0, 10);
      
      gl.enableVertexAttribArray(shader.objectIndexAttribute);
    },
    
    drawGrid: function(gl, shader) {
      gl.bindBuffer(gl.ARRAY_BUFFER, gridVerticesBuffer);
      gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, gridNormalsBuffer);
      gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, gridColorsBuffer);
      gl.vertexAttribPointer(shader.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
      
      gl.disableVertexAttribArray(shader.objectIndexAttribute);
      gl.vertexAttrib2f(shader.objectIndexAttribute, 0.0, 0.0);
            
      gl.lineWidth(0.2);
      gl.drawArrays(gl.LINES, 0, 84);
      
      gl.enableVertexAttribArray(shader.objectIndexAttribute);
    }
  };
});