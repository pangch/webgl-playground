define([], function() {
  
  var objectMap;
  
  var initStaticObjectMap = function(gl, gridSize, radius) {
    // First pos is the origin. Used for static objects in the scene.
    var pos = [0.0, 0.0, 0.0];
    
    var count = gridSize * gridSize;
    for (var i = 0; i < count; i++) {
      var theta = 2.0 * i * Math.PI / count;
      var x = radius * Math.cos(theta);
      var y = radius * Math.sin(theta);
      pos.push(x, y, 0.0);
    }

    // for (var i = 0; i < gridSize; i++) {
    //   for (var j = 0; j < gridSize; j++) {
    //     pos.push(i * 2.0, j * 2.0, 0.0);
    //   }
    // }
    
    var data = new Float32Array(pos);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gridSize, gridSize, 0, gl.RGB, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    objectMap = texture;
  }
  
  var objectMapFrameBuffer;
  var frameBufferDrawn = false;
  
  var initObjectMapFrameBuffer = function(gl, count) {
    // Create framebuffer and bind texture object
    objectMapFrameBuffer = gl.createFramebuffer();    
    gl.bindFramebuffer(gl.FRAMEBUFFER, objectMapFrameBuffer);
    
    objectMapFrameBuffer.width = count + 1;
    objectMapFrameBuffer.height = 1;
        
    objectMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, objectMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, objectMapFrameBuffer.width, objectMapFrameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
    
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, objectMap, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    objectMapFrameBuffer.texture = objectMap;
    
    // Create vertex buffer
    var vertices = [0.0, 0.5, 0.0, count + 1, 0.5, 0.0];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    objectMapFrameBuffer.vertices = buffer;
    
    objectMapFrameBuffer.objectGridSize = count;    
  }
  
  return {
    init: function(gl, gridSize) {
      initStaticObjectMap(gl, gridSize, 10.0);
    },
    
    iterate: function(gl, shader) {
      // if (!frameBufferDrawn) {
      //   gl.useProgram(shader.physicsProgram);
      //   gl.bindFramebuffer(gl.FRAMEBUFFER, objectMapFrameBuffer);
      //
      //   gl.viewport(0, 0, objectMapFrameBuffer.width, objectMapFrameBuffer.height);
      //
      //   gl.bindBuffer(gl.ARRAY_BUFFER, objectMapFrameBuffer.vertices);
      //   gl.vertexAttribPointer(shader.physicsVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      //
      //   gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
      //   gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
      //   gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);
      //
      //   gl.uniform1i(shader.physicsObjectGridSizeUniform, objectMapFrameBuffer.objectGridSize);
      //
      //   gl.lineWidth(1.0);
      //   gl.drawArrays(gl.LINES, 0, 2);
      //
      //   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      // }
      //
      // frameBufferDrawn = true;
    },
    
    getObjectMap: function() {
      return objectMap;
    }
  }
});