define(['./utils', 'text!./vertex.glsl', 'text!./fragment.glsl'], function(utils, vertexShader, fragmentShader) {
  // Create a shader from source
	var buildShader = function(gl, source, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  	throw new Error(gl.getShaderInfoLog(shader));
		}

		return shader;
	}
  
	return {
		init: function(gl) {
			// Build shader program
			var program = gl.createProgram();
	    
	    gl.attachShader(program, buildShader(gl, vertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(program, buildShader(gl, fragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(program);

	    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	      throw new Error("Failed to initialise shaders");
	    }

	    gl.useProgram(program);

	    this.program = program;

	    // Stores shader parameters on this object
	    this.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	    gl.enableVertexAttribArray(this.vertexPositionAttribute);

      this.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
      gl.enableVertexAttribArray(this.vertexColorAttribute);
      
	    this.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
	    gl.enableVertexAttribArray(this.vertexNormalAttribute);
      
      // this.useLightingUniform = gl.getUniformLocation(program, "uPMatrix");
	    this.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	    this.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
      this.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
      
      this.useLightingUniform = gl.getUniformLocation(program, "uUseLighting");
      this.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");      
      this.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");
      this.pointLightingPositionUniform = gl.getUniformLocation(program, "uPointLightingPosition");
		}
	};
});