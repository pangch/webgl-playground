define(['./shader', './models', './camera', './assets', './utils', './math', 'gl-matrix'], function(shader, models, camera, assets, utils, math, glm) {
  
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
  
  var baseSolid;
  var solid;
  
  var currentText, currentDepth, currentConvex;
  
  var initScene = function() {    
    // Build base solid
    var basePolygon = models.Polygon.fromVertices(assets.base);
    baseSolid = models.Primitives.prism(basePolygon, 10.0);  
  };
  
  var updateScene = function() {
    var text = params.getText();
    text = text.replace(/^\s+|\s+$/g, '');
    
    var depth = params.getDepth();    
    var isConvex = params.isConvex();
    if (text === currentText && currentDepth === depth && currentConvex === isConvex && solid) {
      return;
    }
    
    var textSolids = null;
    
    if (text.length) {
      textSolids = models.Text.string(text, 1.0);
    }
    
    if (textSolids) {
      var width = textSolids.width;
      textSolids = textSolids.map(function(solid) { return solid.translate([-width / 2, -2.5, 0.5]); });
      var scaleXY = 1;
      if (width < 50.0) {
        scaleXY = 50.0 / width;
        if (scaleXY > 3.0) {
          scaleXY = 3.0;
        }
      } else if (width > 60.0) {
        scaleXY = 60.0 / width;
      }
      textSolids = textSolids.map(function(solid) { return solid.scale([scaleXY, scaleXY, depth]); });
      solid = baseSolid;
      if (isConvex) {
        textSolids = textSolids.map(function(solid) { return solid.translate([0, 0, depth / 2.0 - 0.001]) });
        for (var i = 0; i < textSolids.length; i++) {
          solid = solid.union(textSolids[i]);
        }
      } else {
        textSolids = textSolids.map(function(solid) { return solid.translate([0, 0, - depth / 2.0 + 0.001]) });
        for (var i = 0; i < textSolids.length; i++) {
          solid = solid.subtract(textSolids[i]);
        }
      }
    } else {
      solid = baseSolid;      
    }    
    solid.color = [1.0, .9, .8, 1.0];
    solid.buildBuffers(gl);
    
    currentText = text;
    currentDepth = depth;
    currentConvex = isConvex;
  }
  
  var drawScene = function() {
    updateScene();
    
    gl.useProgram(shader.program);
    
    var width = params.getViewportWidth();
    var height = params.getViewportHeight();
    
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glm.mat4.perspective(pMatrix, 0.7854, width / height, 0.1, 500.0);
    glm.mat4.rotate(pMatrix, pMatrix, -.2, [1, -1, -1]);
    glm.mat4.translate(pMatrix, pMatrix, [10, 10, -80.0]);
    
    glm.mat4.identity(mvMatrix);
    
    glm.mat4.translate(mvMatrix, mvMatrix, [0, 0, camera.getZPos()]);
    
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getXRot(), [0, 1, 0]);
    glm.mat4.rotate(mvMatrix, mvMatrix, camera.getYRot(), [1, 0, 0]);
    
    setMatrixUniforms();
    
    gl.uniform1i(shader.useLightingUniform, true);
    gl.uniform3f(shader.ambientColorUniform, 0.4, 0.4, 0.4);

    gl.uniform3f(shader.pointLightingPositionUniform, 20.0, 0.0, 35.0);
    gl.uniform3f(shader.pointLightingColorUniform, 0.6, 0.6, 0.6);
    
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
      
      initScene();
      shader.init(gl);
      
      gl.clearColor(.3, .3, .3, 1.0);
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