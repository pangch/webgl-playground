define(['./utils', 'text!./vertex.glsl', 'text!./fragment.glsl'], function(utils, vertexShader, fragmentShader) {
	return {
		init: function(gl) {
			// Build shader program
			var program = gl.createProgram();
	    
	    gl.attachShader(program, utils.buildShader(gl, vertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(program, utils.buildShader(gl, fragmentShader, gl.FRAGMENT_SHADER));
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
      this.pointLightingDirectionUniform = gl.getUniformLocation(program, "uPointLightingDirection");
		}
	};
});