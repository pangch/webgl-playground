define(['./shader', './models', './camera', 'gl-matrix'], function(shader, models, camera, glm) {
  
  var gl;
  var params;

  var pMatrix = glm.mat4.create();   // Projection matrix
  var mvMatrix = glm.mat4.create();  // Modelview matrix

  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);    
  };
  
  var solid;
  var drawScene = function() {
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
    
    solid.draw(gl, shader);
  };
  
  var animFramRequest;
  var updateFrame = function() {
    animFramRequest = requestAnimFrame(updateFrame);
    
    camera.animate();
    drawScene();
  };

  return {
    initScene: function() {
      var poly = models.Polygon.fromVertices([
        [0.0, 0.0, 0.0],
        [1.0, 0.0, 0.0],
        [1.0, 1.0, 0.0],
        [0.5, 1.5, 0.0],
        [0.0, 1.0, 0.0]
      ]);
      solid = models.Solid.fromPolygons([poly]);
      solid.buildBuffers(gl);
    },
    
    init: function(_gl, _params) {
      gl = _gl; 
      params = _params;
      
      shader.init(gl);
      this.initScene();
      
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