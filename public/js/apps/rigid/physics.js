define(['gl-matrix'], function(glm) {
  
  // The size of the 2D grids mapping position and velocity of each object.
  var objectMapSize;
  
  var fillRectangle;
  var objectPoints;
  
  var initialObjectPositionMap;
  var initialObjectVelocityMap;
  
  var objectPositionMapFrameBuffer;
  var objectPositionMapFrameBuffer1;
  var objectVelocityMapFrameBuffer;
  var objectVelocityMapFrameBuffer1;

  // An 3D grid to locate all objects
  var spaceGridSize = 256;
  var spaceGridTextureSize = 4096; // 256 ** 3 == 4096 ** 2
  var spaceGridFrameBuffer;
  
  var useInitialObjectMaps = true;
  
  var initInitialObjectPositionMap = function(gl) {
    if (initialObjectVelocityMap) {
      gl.deleteTexture(initialObjectPositionMap);
    }
    
    // First pos is the origin. Used for static objects in the scene.
    var pos = [];
    
    var oneGrid = 120 / objectMapSize;
    var halfGrid = oneGrid / 2;
    for (var i = 0; i < objectMapSize; i++) {
      for (var j = 0; j < objectMapSize; j++) {
        pos.push(Math.random() * 72, Math.random() * 72 , Math.random() * 72);
      }      
    }
    
    var data = new Float32Array(pos);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, objectMapSize, objectMapSize, 0, gl.RGB, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    initialObjectPositionMap = texture;
  }
  
  var initInitialObjectVelocityMap = function(gl) {
    if (initialObjectVelocityMap) {
      gl.deleteTexture(initialObjectVelocityMap);
    }
    
    // First pos is the origin. Used for static objects in the scene.
    var pos = [];

    for (var i = 0; i < objectMapSize; i++) {
      for (var j = 0; j < objectMapSize; j++) {
        pos.push((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, (Math.random() - 0.3) * 0.05);
      }      
    }
    
    var data = new Float32Array(pos);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, objectMapSize, objectMapSize, 0, gl.RGB, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    initialObjectVelocityMap = texture;
  }
  
  // Create boundary object buffers
  var initFillRectangle = function(gl) {    
    fillRectangle = {};
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
    fillRectangle.vertices = buffer;
  }
  
  var initObjectPoints = function(gl) {
    objectPoints = {};
    var vertices = [];
    for (var i = 0; i < objectMapSize; i++) {
      for (var j = 0; j < objectMapSize; j++) {
        vertices.push(i / objectMapSize, j / objectMapSize);
      }
    }
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    objectPoints.vertices = buffer;
    objectPoints.vertexCount = objectMapSize * objectMapSize;
  }
  
  // Create framebuffer and bind texture object
  var createFrameBuffer = function(gl, size) {    
    var frameBuffer = gl.createFramebuffer();    
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, size, size, 0, gl.RGB, gl.FLOAT, null);
    
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    frameBuffer.texture = texture;
    return frameBuffer;
  }
  
  var initObjectMapFrameBuffers = function(gl) {
    objectPositionMapFrameBuffer = createFrameBuffer(gl, objectMapSize);
    objectPositionMapFrameBuffer1 = createFrameBuffer(gl, objectMapSize);
    objectVelocityMapFrameBuffer = createFrameBuffer(gl, objectMapSize);
    objectVelocityMapFrameBuffer1 = createFrameBuffer(gl, objectMapSize);
  }

  var initSpaceGridFrameBuffer = function(gl) {
    spaceGridFrameBuffer = createFrameBuffer(gl, spaceGridTextureSize);
  }
    
  // In each iteration, old object positions/velocity are read from the old 
  // buffer and written to the new buffer. At the end of each iteration,
  // the buffers are swapped.
  var swapBuffers = function() {    
    var tmp = objectPositionMapFrameBuffer;
    objectPositionMapFrameBuffer = objectPositionMapFrameBuffer1;
    objectPositionMapFrameBuffer1 = tmp;
    
    tmp = objectVelocityMapFrameBuffer;
    objectVelocityMapFrameBuffer = objectVelocityMapFrameBuffer1;
    objectVelocityMapFrameBuffer1 = tmp;    
  }
  
  // Draw a rentangle covering the whole viewport
  var drawFillRectangle = function(gl, vertexAttribute) {
    gl.bindBuffer(gl.ARRAY_BUFFER, fillRectangle.vertices);
    gl.vertexAttribPointer(vertexAttribute, 2, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  // Draw the index of each object as a point.
  var drawObjectPoints = function(gl, vertexAttribute) {
    gl.bindBuffer(gl.ARRAY_BUFFER, objectPoints.vertices);
    gl.vertexAttribPointer(vertexAttribute, 2, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.POINTS, 0, objectPoints.vertexCount);
  }
  
  // Calculate the velocity of each object for the next iteration. 
  // All the collision, bouncing, gravity simulation is done at this step.
  var updateObjectVelocityMap = function(gl, shader) {
    gl.useProgram(shader.objectVelocityProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, objectVelocityMapFrameBuffer);
    
    gl.viewport(0, 0, objectMapSize, objectMapSize);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bind old object position
    gl.activeTexture(gl.TEXTURE0);    
    if (useInitialObjectMaps) {
      gl.bindTexture(gl.TEXTURE_2D, initialObjectPositionMap);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, objectPositionMapFrameBuffer1.texture);
    }    
    gl.uniform1i(shader.objectVelocityProgram.objectPositionMapUniform, 0);
    
    // Bind old velocity
    gl.activeTexture(gl.TEXTURE1);    
    if (useInitialObjectMaps) {
      gl.bindTexture(gl.TEXTURE_2D, initialObjectVelocityMap);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, objectVelocityMapFrameBuffer1.texture);
    }
    gl.uniform1i(shader.objectVelocityProgram.objectVelocityMapUniform, 1);    
    
    // Bind space grid
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, spaceGridFrameBuffer.texture);
    gl.uniform1i(shader.objectVelocityProgram.spaceGridUniform, 2);    
        
    gl.uniform1i(shader.objectVelocityProgram.spaceGridSizeUniform, spaceGridSize);
    gl.uniform1i(shader.objectVelocityProgram.spaceGridBlockSizeUniform, spaceGridTextureSize / spaceGridSize);
    gl.uniform1f(shader.objectVelocityProgram.spaceGridTextureSizeInverseUniform, 1.0 / spaceGridTextureSize);
    
    gl.enableVertexAttribArray(shader.objectVelocityProgram.vertexPositionAttribute);
    drawFillRectangle(gl, shader.objectVelocityProgram.vertexPositionAttribute);
    
    gl.disableVertexAttribArray(shader.objectVelocityProgram.vertexPositionAttribute);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };
  
  // Calculate the position of each object for the next iteration
  var updateObjectPositionMap = function(gl, shader) {
    gl.useProgram(shader.objectPositionProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, objectPositionMapFrameBuffer);
    
    gl.viewport(0, 0, objectMapSize, objectMapSize);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bind old object position
    gl.activeTexture(gl.TEXTURE0);    
    if (useInitialObjectMaps) {
      gl.bindTexture(gl.TEXTURE_2D, initialObjectPositionMap);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, objectPositionMapFrameBuffer1.texture);
    }    
    gl.uniform1i(shader.objectPositionProgram.objectPositionMapUniform, 0);
    
    // Bind old velocity
    gl.activeTexture(gl.TEXTURE1);    
    if (useInitialObjectMaps) {
      gl.bindTexture(gl.TEXTURE_2D, initialObjectVelocityMap);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, objectVelocityMapFrameBuffer1.texture);
    }
    gl.uniform1i(shader.objectPositionProgram.objectVelocityMapUniform, 1);
        
    gl.uniform1i(shader.objectPositionProgram.objectMapSizeUniform, objectMapSize);
    
    gl.enableVertexAttribArray(shader.objectPositionProgram.vertexPositionAttribute);
    drawFillRectangle(gl, shader.objectPositionProgram.vertexPositionAttribute);
    
    gl.disableVertexAttribArray(shader.objectPositionProgram.vertexPositionAttribute);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };
  
  // Generate a dictionary from a 3D coordinate in the space to the object occupying that
  // coordinate. The dictionary is formatted as a 2D texture.
  var generateSpaceGrid = function(gl, shader) {
    gl.useProgram(shader.spaceGridProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, spaceGridFrameBuffer);
    
    gl.viewport(0, 0, spaceGridTextureSize, spaceGridTextureSize);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bind position map
    gl.activeTexture(gl.TEXTURE0);    
    if (useInitialObjectMaps) {
      gl.bindTexture(gl.TEXTURE_2D, initialObjectPositionMap);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, objectPositionMapFrameBuffer1.texture);
    }    
    gl.uniform1i(shader.spaceGridProgram.objectPositionMapUniform, 0);
    
    gl.uniform1i(shader.spaceGridProgram.spaceGridSizeUniform, spaceGridSize);
    gl.uniform1i(shader.spaceGridProgram.spaceGridBlockSizeUniform, spaceGridTextureSize / spaceGridSize);
    gl.uniform1f(shader.spaceGridProgram.spaceGridTextureSizeInverseUniform, 1.0 / spaceGridTextureSize);
    
    gl.enableVertexAttribArray(shader.spaceGridProgram.vertexPositionAttribute);
    drawObjectPoints(gl, shader.spaceGridProgram.vertexPositionAttribute);
    
    gl.disableVertexAttribArray(shader.spaceGridProgram.vertexPositionAttribute);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  
  var drawSpaceGridVisualization = function(gl, shader) {
    gl.useProgram(shader.spaceGridVisualizationProgram);
    
    gl.viewport(0, 0, spaceGridTextureSize * 10.0, spaceGridTextureSize * 10.0);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bind position map
    gl.activeTexture(gl.TEXTURE0);    
    gl.bindTexture(gl.TEXTURE_2D, spaceGridFrameBuffer.texture);
    
    gl.uniform1i(shader.spaceGridVisualizationProgram.spaceGridUniform, 0);
    
    gl.enableVertexAttribArray(shader.spaceGridVisualizationProgram.vertexPositionAttribute);
    drawFillRectangle(gl, shader.spaceGridProgram.vertexPositionAttribute);
    
    gl.disableVertexAttribArray(shader.spaceGridVisualizationProgram.vertexPositionAttribute);    
  }
  
  return {
    init: function(gl, _objectMapSize) {
      objectMapSize = _objectMapSize;
      
      initInitialObjectPositionMap(gl, 10.0);
      initInitialObjectVelocityMap(gl);
      
      initFillRectangle(gl);
      initObjectPoints(gl);

      initObjectMapFrameBuffers(gl);
      initSpaceGridFrameBuffer(gl);
      
      useInitialObjectMaps = true;
    },
    
    iterate: function(gl, shader) {
      // For each frame, run the physical simulation multiple times
      // to make the objects move faster while not loosing the accuracy
      // of the simulation.
      for (var i = 0; i < 28; i++) {
        swapBuffers();
      
        generateSpaceGrid(gl, shader);
        // drawSpaceGridVisualization(gl, shader);
        updateObjectVelocityMap(gl, shader);
        updateObjectPositionMap(gl, shader);
        useInitialObjectMaps = false;
      }      
    },
    
    getObjectPositionMap: function() {
      return objectPositionMapFrameBuffer.texture;
    },
    
    reset: function(gl) {
      initInitialObjectPositionMap(gl, 10.0);
      initInitialObjectVelocityMap(gl);
      useInitialObjectMaps = true;      
    }
  }
});