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
  
  var solid;

  var initScene = function() {
    
    var solidA = models.Text.char('a', 1.0).translate([-2.5, -2.5, 0.0]);
    var solidB = models.Text.char('b', 1.0).translate([3.0, -2.5, 0.0]);
    solid = solidA.union(solidB);
    solid.color = [1.0, 0.5, 0.5, 1.0];    
    solid.buildBuffers(gl);
  };
  
  var drawScene = function() {
    
    gl.useProgram(shader.program);
    
    var width = params.getViewportWidth();
    var height = params.getViewportHeight();
    
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glm.mat4.perspective(pMatrix, 0.7854, width / height, 0.1, 100.0);
    
    glm.mat4.identity(mvMatrix);
    
    glm.mat4.translate(mvMatrix, mvMatrix, [0, 0, camera.getZPos()]);
    
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getXRot(), [0, 1, 0]);
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getYRot(), [1, 0, 0]);
    
    setMatrixUniforms();
    utils.drawAxis(gl, shader);
    
    gl.uniform1i(shader.useLightingUniform, true);
    gl.uniform3f(shader.ambientColorUniform, 0.2, 0.2, 0.2);

    gl.uniform3f(shader.pointLightingPositionUniform, 2.5, 0.0, 0.0);
    gl.uniform3f(shader.pointLightingColorUniform, 0.8, 0.8, 0.8);
    
    solid.draw(gl, shader);
    // solidB.draw(gl, shader);
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
      
      initScene();
      shader.init(gl);
      
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
    },

    run: function() {
      updateFrame();
    },
    
    exit: function() {
      solid = null;
      cancelRequestAnimFrame(animFramRequest);
    }
  };
});