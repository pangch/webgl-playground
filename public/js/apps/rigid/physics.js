define(['gl-matrix'], function(glm) {
  
  var gridSize;
  var objectMap;
  
  var boundaryObject;
  var objectMapFrameBuffer;
  var frameBufferDrawn = false;
  
  var initStaticObjectMap = function(gl, radius) {
    // First pos is the origin. Used for static objects in the scene.
    var pos = [0.0, 0.0, 0.0];
    
    var count = gridSize * gridSize;
    for (var i = 0; i < count; i++) {
      var theta = 2.0 * i * Math.PI / count;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);
      pos.push(x, y, 0.0);
    }
    
    var data = new Float32Array(pos);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gridSize, gridSize, 0, gl.RGB, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    objectMap = texture;
    
    frameBufferDrawn = true;
  }
  
  var initObjectMapFrameBuffer = function(gl) {
    // Create framebuffer and bind texture object
    objectMapFrameBuffer = gl.createFramebuffer();    
    gl.bindFramebuffer(gl.FRAMEBUFFER, objectMapFrameBuffer);
    
    objectMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, objectMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gridSize, gridSize, 0, gl.RGBA, gl.FLOAT, null);
    
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, objectMap, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    objectMapFrameBuffer.texture = objectMap;
    
    // Create boundary object buffers
    boundaryObject = {};
    var vertices = [0.0, 0.0, 0.0, gridSize, 0.0, 0.0, gridSize, gridSize, 0.0, 0.0, gridSize, 0.0];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    boundaryObject.vertices = buffer;
    
    var indices = [0, 1, 2, 0, 2, 3];
    var indicesBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    boundaryObject.indices = indicesBuffer;
    boundaryObject.indexCount = indices.length;
  }
  
  return {
    init: function(gl, _gridSize) {
      gridSize = _gridSize;
      
      // initStaticObjectMap(gl, 10.0);
      initObjectMapFrameBuffer(gl);
    },
    
    iterate: function(gl, shader) {
      if (!frameBufferDrawn) {
        gl.useProgram(shader.physicsProgram);
        gl.bindFramebuffer(gl.FRAMEBUFFER, objectMapFrameBuffer);

        gl.viewport(0, 0, gridSize, gridSize);
        
        var mvpMatrix = glm.mat4.ortho(glm.mat4.create(), 0, gridSize, 0, gridSize, 0.5, -0.5);
        gl.uniformMatrix4fv(shader.mvpMatrixUniform, false, mvpMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryObject.vertices);
        gl.vertexAttribPointer(shader.physicsVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundaryObject.indices);
        gl.drawElements(gl.TRIANGLES, boundaryObject.indexCount, gl.UNSIGNED_SHORT, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }

      frameBufferDrawn = true;
    },
    
    getObjectMap: function() {
      return objectMap;
    }
  }
});