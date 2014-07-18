define([
  './shader', 
  './models', 
  './camera',
  './physics', 
  './math', 
  './utils', 
  'gl-matrix'
  ], function(
    shader, 
    models, 
    camera,
    physics,
    math, 
    utils, 
    glm) {
  
  var gl;
  var params;

  var pMatrix = glm.mat4.create();   // Projection matrix
  var mvMatrix = glm.mat4.create();  // Modelview matrix
  
  var objectMapSize = 8;
  
  var setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);
    
    var normalMatrix = glm.mat3.create();
    math.mat4ToInverseMat3(mvMatrix, normalMatrix);
    glm.mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(shader.nMatrixUniform, false, normalMatrix); 
  };

  var drawScene = function() {
    var width = params.getViewportWidth();
    var height = params.getViewportHeight();
    
    gl.useProgram(shader.program);
    
    gl.viewport(0, 0, width, height);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glm.mat4.perspective(pMatrix, 0.7854, width / height, 0.1, 2000.0);
        
    glm.mat4.translate(pMatrix, pMatrix, [-20.0, -40.0, -160.0]);    
    glm.mat4.rotate(pMatrix, pMatrix, -1.87, [0, 1, 0]);
    glm.mat4.rotate(pMatrix, pMatrix, -1.57, [1, 0, 0]);    
    
    glm.mat4.identity(mvMatrix);
    
    glm.mat4.translate(mvMatrix, mvMatrix, [-40, -15, 0]);
    
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getXRot(), [0, 0, 1]);
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getYRot(), [0, 1, 0]);    
    
    setMatrixUniforms();
    
    // Lighting
    gl.uniform1i(shader.useLightingUniform, true);
    gl.uniform3f(shader.ambientColorUniform, 0.5, 0.5, 0.5);
    
    gl.uniform3f(shader.pointLightingPositionUniform, 50.0, 50.0, 150.0);
    gl.uniform3f(shader.pointLightingColorUniform, 0.5, 0.5, 0.5);
    
    // Bind position map
    var objectPositionMap = physics.getObjectPositionMap();
    gl.activeTexture(gl.TEXTURE0);    
    gl.bindTexture(gl.TEXTURE_2D, objectPositionMap);
    gl.uniform1i(shader.objectPositionMapUniform, 0);
    gl.uniform1i(shader.objectMapSizeUniform, objectMapSize);
    
    gl.uniform1i(shader.drawingObjectsUniform, false);
    
    gl.enableVertexAttribArray(shader.vertexPositionAttribute);
    gl.enableVertexAttribArray(shader.vertexColorAttribute);  
    gl.enableVertexAttribArray(shader.vertexNormalAttribute);    
    gl.enableVertexAttribArray(shader.objectIndexAttribute);
    
    models.drawAxis(gl, shader);    
    models.drawGrid(gl, shader);
    gl.uniform1i(shader.drawingObjectsUniform, true);
    
    // Draw all objects
    models.draw(gl, shader);
    
    gl.disableVertexAttribArray(shader.vertexPositionAttribute);
    gl.disableVertexAttribArray(shader.vertexColorAttribute);  
    gl.disableVertexAttribArray(shader.vertexNormalAttribute);    
    gl.disableVertexAttribArray(shader.objectIndexAttribute);
  };
  
  var animFramRequest;
  var updateFrame = function() {
    animFramRequest = requestAnimFrame(updateFrame);
    
    camera.animate();
    physics.iterate(gl, shader);
    drawScene(); 
  };

  return {
    init: function(_gl, _params) {
      gl = _gl; 
      params = _params;
      
      var floatTextureExt = gl.getExtension('OES_texture_float');
      if (!floatTextureExt) {
        throw new Error("WebGL OES_texture_float extension not supported.");
      }

      shader.init(gl);
      physics.init(gl, objectMapSize);
      models.init(gl, objectMapSize);
      
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
      if (evt.type === 'keydown' && evt.keyCode === 82) {
        physics.reset(gl);
      }
      return true;
    }
  };
});