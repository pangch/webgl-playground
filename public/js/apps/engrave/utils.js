define(function() {
	return {
    
    // Create a shader from source
		buildShader: function(gl, source, type) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  	throw new Error(gl.getShaderInfoLog(shader));
			}

			return shader;
		},
    
    drawAxis: (function() {
      
      var colorsBuffer = null;
      var verticesBuffer = null;
      
      var initBuffer = function(gl) {
        var vertices = [
            0.0,   0.0,   0.0,
          100.0,   0.0,   0.0,
            0.0,   0.0,   0.0,
            0.0, 100.0,   0.0,
            0.0,   0.0,   0.0,
            0.0,   0.0, 100.0
        ];
      
        verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      
        var colors = [
          1.0, 0.0, 0.0, 1.0,
          1.0, 0.0, 0.0, 1.0,
          0.0, 1.0, 0.0, 1.0,
          0.0, 1.0, 0.0, 1.0,
          0.0, 0.0, 1.0, 1.0,
          0.0, 0.0, 1.0, 1.0
        ];
      
        colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      }
      
      return function(gl, shader) {
        if (!verticesBuffer) {
          initBuffer(gl);
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.vertexAttribPointer(shader.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.lineWidth(1.0);
        gl.drawArrays(gl.LINES, 0, 6);
      };
    })()
	}
});