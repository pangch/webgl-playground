define(['./shader', './models', './camera', 'gl-matrix'], function(shader, models, camera, glm) {
  
  var gl;
  var params;

  var pMatrix = glm.mat4.create();   // Projection matrix
  var mvMatrix = glm.mat4.create();  // ModelView matrix

  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);    
  };
  
  var drawObject = function(object) {
    setMatrixUniforms();    
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, object.texture);
    gl.uniform1i(shader.textureUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.textureCoords);
    gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    
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
    
    var position = camera.getPosition();
    glm.vec3.negate(position, position);
    glm.mat4.translate(pMatrix, pMatrix, position);
    
    glm.mat4.identity(mvMatrix);
    
    drawObject(models.objects.floor);
    drawObject(models.objects.walls);
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
      models.init(gl);
      
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
    },

    run: function() {
      updateFrame();
    },
    
    exit: function() {
      cancelRequestAnimFrame(animFramRequest);
    }
  };
});