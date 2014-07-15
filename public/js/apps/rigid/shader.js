define(['./utils', 
        'text!./vertex.glsl', 
        'text!./fragment.glsl',
        'text!./physics-vertex.glsl',
        'text!./physics-fragment.glsl'
        ], function(
        utils, 
        vertexShader, 
        fragmentShader,
        physicsVertexShader,
        physicsFragmentShader) {
  
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
      // Build physics shaders
      var physicsProgram = gl.createProgram();
      
	    gl.attachShader(physicsProgram, buildShader(gl, physicsVertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(physicsProgram, buildShader(gl, physicsFragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(physicsProgram);

	    if (!gl.getProgramParameter(physicsProgram, gl.LINK_STATUS)) {
	      throw new Error("Failed to initialise shaders");
	    }

	    this.physicsProgram = physicsProgram;
            
      this.physicsVertexPositionAttribute = gl.getAttribLocation(physicsProgram, "aVertexPosition");
	    gl.enableVertexAttribArray(this.physicsVertexPositionAttribute);
      
      this.physicsGridSizeUniform = gl.getUniformLocation(physicsProgram, "uGridSize");
      
      // Build main shader
			var program = gl.createProgram();
	    
	    gl.attachShader(program, buildShader(gl, vertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(program, buildShader(gl, fragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(program);

	    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	      throw new Error("Failed to initialise shaders");
	    }
      
	    this.program = program;
      
	    // Stores shader parameters on this object
	    this.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	    gl.enableVertexAttribArray(this.vertexPositionAttribute);

      this.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
      gl.enableVertexAttribArray(this.vertexColorAttribute);
      
	    this.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
	    gl.enableVertexAttribArray(this.vertexNormalAttribute);
      
      this.objectIndexAttribute = gl.getAttribLocation(program, "aObjectIndex");
	    gl.enableVertexAttribArray(this.objectIndexAttribute);
      
      this.objectMapUniform = gl.getUniformLocation(program, "uObjectMap");
      
	    this.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	    this.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
      this.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
      
      this.drawingObjectsUniform = gl.getUniformLocation(program, "uDrawingObjects");
      
      this.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");      
      this.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");
      this.pointLightingPositionUniform = gl.getUniformLocation(program, "uPointLightingPosition");      
		}
	};
});