define(['./shader', './models', 'gl-matrix'], function(shader, models, glm) {
  
  var gl;
  var params;

  var pMatrix = glm.mat4.create();   // Projection matrix
  var mvMatrix = glm.mat4.create();  // Modelview matrix

  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);    
  };

  var drawScene = function() {
    var width = params.getViewportWidth();
    var height = params.getViewportHeight();
    
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glm.mat4.perspective(pMatrix, 0.7854, width / height, 0.1, 100.0);
    glm.mat4.identity(mvMatrix);
    glm.mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);
    
    setMatrixUniforms();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, models.triangleVertexPosition);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, models.triangleVertexPosition.itemSize, gl.FLOAT, false, 0, 0);
    
    // setMatrixUniforms();
    // gl.drawArrays(gl.TRIANGLES, 0, models.triangleVertexPosition.numItems);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, models.triangleIndices);
    gl.drawElements(gl.TRIANGLES, models.triangleIndices.numItems, gl.UNSIGNED_SHORT, 0);

    glm.mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, models.squareVertexPosition);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, models.squareVertexPosition.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, models.squareVertexPosition.numItems);
  };
  
  var animFramRequest;
  var updateFrame = function() {
    animFramRequest = requestAnimFrame(updateFrame);
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