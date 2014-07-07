define(['common/utils', 'text!./vertex.glsl', 'text!./fragment.glsl'], function(utils, vertexShader, fragmentShader) {
	return {
		init: function(gl) {
			// Build shader program
			var program = gl.createProgram();
	    
	    gl.attachShader(program, utils.buildShader(gl, vertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(program, utils.buildShader(gl, fragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(program);

	    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	      throw "Failed to initialise shaders";
	    }

	    this.program = program;

	    // Stores shader parameters on this object
	    this.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	    gl.enableVertexAttribArray(this.vertexPositionAttribute);
      
      this.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
      gl.enableVertexAttribArray(this.textureCoordAttribute);

	    this.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	    this.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
      this.textureUniform = gl.getUniformLocation(program, "uTexture");
		}
	};
});