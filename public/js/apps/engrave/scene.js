define(['./shader', './models', './camera', './utils', './math', 'gl-matrix'], function(shader, models, camera, utils, math, glm) {
  
  var gl;
  var params;

  var pMatrix = glm.mat4.create();   // Projection matrix
  var mvMatrix = glm.mat4.create();  // Modelview matrix

  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);
    
    var normalMatrix = glm.mat3.create();
    math.mat4ToInverseMat3(mvMatrix, normalMatrix);
    glm.mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(shader.nMatrixUniform, false, normalMatrix); 
  };
  
  var solid = null;
  var drawScene = function() {
    
    if (!solid) {
      solid = models.Primitives.cube([-1.0, -1.0, -1.0], 2.0);
      solid.buildBuffers(gl);
    }
    
    var width = params.getViewportWidth();
    var height = params.getViewportHeight();
    
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glm.mat4.perspective(pMatrix, 0.7854, width / height, 0.1, 100.0);
    
    glm.mat4.identity(mvMatrix);
    
    glm.mat4.translate(mvMatrix, mvMatrix, [0, 0, -10]);
    
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getXRot(), [0, 1, 0]);
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getYRot(), [1, 0, 0]);
    
    setMatrixUniforms();
    utils.drawAxis(gl, shader);
    
    gl.uniform1i(shader.useLightingUniform, true);
    gl.uniform3f(shader.ambientColorUniform, 0.2, 0.2, 0.2);

    var lightingDirection = glm.vec3.normalize(glm.vec3.create(), [1.0, 1.0, 1.0]);    
    gl.uniform3fv(shader.pointLightingDirectionUniform, lightingDirection);
    gl.uniform3f(shader.pointLightingColorUniform, 1.0, 0.95, 0.9);
    
    solid.draw(gl, shader);
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