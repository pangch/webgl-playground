define(['gl-matrix'], function(glm) {
  
  var gridSize;
  var objectMap;
  
  var boundaryObject;
  var objectMapFrameBuffer;
  var frameBufferDrawn = false;
  
  var initStaticObjectMap = function(gl, radius) {
    // First pos is the origin. Used for static objects in the scene.
    var pos = [0.0, 0.0];
    
    var count = gridSize * gridSize;
    for (var i = 0; i < count; i++) {
      var theta = 2.0 * i * Math.PI / count;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);
      pos.push(x, y);
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
    var vertices = [
        -1.0, -1.0, 
         1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
         1.0, -1.0, 
         1.0,  1.0];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    boundaryObject.vertices = buffer;    
  }
  
  return {
    init: function(gl, _gridSize) {
      gridSize = _gridSize;
      
      // initStaticObjectMap(gl, 10.0);
      initObjectMapFrameBuffer(gl);
    },
    
    iterate: function(gl, shader) {
      // if (!frameBufferDrawn) {
        gl.useProgram(shader.physicsProgram);
        gl.bindFramebuffer(gl.FRAMEBUFFER, objectMapFrameBuffer);
        
        gl.viewport(0, 0, gridSize, gridSize);
        
        gl.clearColor(-10.0, -10.0, -10.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, boundaryObject.vertices);
        gl.vertexAttribPointer(shader.physicsVertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shader.physicsGridSizeUniform, gridSize);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      // }

      frameBufferDrawn = true;
    },
    
    getObjectMap: function() {
      return objectMap;
    }
  }
});