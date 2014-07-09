define(['./shader', './world', './camera', './mat', 'gl-matrix'], function(shader, world, camera, mat, glm) {
  
  var gl;
  var params;

  var pMatrix = glm.mat4.create();   // Projection matrix
  var mvMatrix = glm.mat4.create();  // ModelView matrix
  
  var useLighting = false;

  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);
    
    var normalMatrix = glm.mat3.create();
    mat.toInverseMat3(mvMatrix, normalMatrix);
    glm.mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(shader.nMatrixUniform, false, normalMatrix);
  };
  
  var drawObject = function(object) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, object.texture);
    gl.uniform1i(shader.textureUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.textureCoords);
    gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, object.normals);
    gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertices);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indices);
    gl.drawElements(gl.TRIANGLES, object.indexCount, gl.UNSIGNED_SHORT, 0);
  };

  var drawScene = function() {
    var width = params.getViewportWidth();
    var height = params.getViewportHeight();
    
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(shader.program);
    
    // Perspective projection with fovy of 45 degree
    glm.mat4.perspective(pMatrix, 0.7854, width / height, 0.1, 100.0);
    
    // Start by rotating the camera 90 degrees about x axis, so that z axis points 
    // upward from the initial camera's view
    glm.mat4.rotate(pMatrix, pMatrix, -1.57079633, [1, 0, 0]);
    
    glm.mat4.rotate(pMatrix, pMatrix, -camera.getPitch(), [1, 0, 0]);
    glm.mat4.rotate(pMatrix, pMatrix, -camera.getYaw(), [0, 0, 1]);
    
    var pos = camera.getPosition();
    glm.mat4.translate(pMatrix, pMatrix, [-pos[0], -pos[1], -pos[2]]);
    
    glm.mat4.identity(mvMatrix);
    gl.uniform1i(shader.useLightingUniform, useLighting);
    if (useLighting) {
        gl.uniform3f(shader.ambientColorUniform, 0.2, 0.2, 0.2);
        gl.uniform3f(shader.pointLightingLocationUniform, pos[0], pos[1], pos[2]);
        gl.uniform3f(shader.pointLightingColorUniform, 1.0, 0.95, 0.9);
        
        var cameraDir = camera.getCameraDirection();        
        gl.uniform3f(shader.pointLightingDirectionUniform, cameraDir[0], cameraDir[1], cameraDir[2]);
    }
    
    setMatrixUniforms();    
    drawObject(world.objects.floor);
    for (var i = 0; i < world.objects.walls.length; i++) {
      drawObject(world.objects.walls[i]);
    }
    
    // Disable lighting when drawing sky
    gl.uniform1i(shader.useLightingUniform, false);
    drawObject(world.objects.sky);    
  };
  
  var animFramRequest;
  var updateFrame = function() {
    animFramRequest = requestAnimFrame(updateFrame);
    
    camera.animate();
    drawScene();
  };

  return {
    init: function(_gl, _params) {
      gl = _gl; 
      params = _params;
      
      shader.init(gl);
      world.init(gl);
      
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
    },

    run: function() {
      updateFrame();
    },
    
    exit: function() {
      cancelRequestAnimFrame(animFramRequest);
    },
    
    handleKeyEvent: function(evt) {
      if (evt.type === 'keydown' && evt.keyCode === 76) {
        useLighting = !useLighting;
        console.log("Use lighting: ", useLighting);
      }
      return true;
    }
  };
});