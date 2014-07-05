define(['./shader', './buffers', 'gl-matrix'], function(shader, buffers, glm) {
  
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
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.triangleVertexPosition);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, buffers.triangleVertexPosition.itemSize, gl.FLOAT, false, 0, 0);
    
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, buffers.triangleVertexPosition.numItems);

    glm.mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.squareVertexPosition);
    gl.vertexAttribPointer(shader.vertexPositionAttribute, buffers.squareVertexPosition.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.squareVertexPosition.numItems);
  };
  
  var updateFrame = function() {
    requestAnimFrame(updateFrame);
    drawScene();
  };

  return {
    init: function(_gl, _params) {
      gl = _gl; 
      params = _params;
      
      shader.init(gl);
      buffers.init(gl);
      
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
    },

    run: function() {
      updateFrame();
    }
  };
});