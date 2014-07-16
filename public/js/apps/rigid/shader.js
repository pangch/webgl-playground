define(['./utils', 
        'text!./vertex.glsl', 
        'text!./fragment.glsl',
        'text!./fill-rectangle-vertex.glsl',
        'text!./object-points-vertex.glsl',
        'text!./space-grid-fragment.glsl',        
        'text!./object-position-fragment.glsl',
        'text!./object-velocity-fragment.glsl'
        ], function(
        utils, 
        vertexShader, 
        fragmentShader,
        fillRectangleVertexShader,
        objectPointsVertexShader,
        spaceGridFragmentShader,
        objectPositionFragmentShader,
        objectVelocityFragmentShader) {
  
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
      //
      // Build simulation shaders
      //
      
      // Space grid generation
      var spaceGridProgram = gl.createProgram();
      
	    gl.attachShader(spaceGridProgram, buildShader(gl, objectPointsVertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(spaceGridProgram, buildShader(gl, spaceGridFragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(spaceGridProgram);

	    if (!gl.getProgramParameter(spaceGridProgram, gl.LINK_STATUS)) {
	      throw new Error("Failed to initialise shaders");
	    }

      spaceGridProgram.vertexPositionAttribute = gl.getAttribLocation(spaceGridProgram, "aVertexPosition");
      spaceGridProgram.spaceGridBlockSizeUniform = gl.getUniformLocation(spaceGridProgram, "uSpaceGridBlockSize");
      spaceGridProgram.spaceGridTextureSizeInverseUniform = gl.getUniformLocation(spaceGridProgram, "uSpaceGridTextureSizeInverse");
      spaceGridProgram.objectPositionMapUniform = gl.getUniformLocation(spaceGridProgram, "uObjectPositionMap");
	    this.spaceGridProgram = spaceGridProgram;
      
      // Object velocity output
      var objectVelocityProgram = gl.createProgram();
      
	    gl.attachShader(objectVelocityProgram, buildShader(gl, fillRectangleVertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(objectVelocityProgram, buildShader(gl, objectVelocityFragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(objectVelocityProgram);

	    if (!gl.getProgramParameter(objectVelocityProgram, gl.LINK_STATUS)) {
	      throw new Error("Failed to initialise shaders");
	    }

      objectVelocityProgram.vertexPositionAttribute = gl.getAttribLocation(objectVelocityProgram, "aVertexPosition");
      objectVelocityProgram.objectMapSizeUniform = gl.getUniformLocation(objectVelocityProgram, "uObjectMapSize");
      objectVelocityProgram.objectPositionMapUniform = gl.getUniformLocation(objectVelocityProgram, "uObjectPositionMap");
      objectVelocityProgram.objectVelocityMapUniform = gl.getUniformLocation(objectVelocityProgram, "uObjectVelocityMap");
	    this.objectVelocityProgram = objectVelocityProgram;
      
      // Object position output
      var objectPositionProgram = gl.createProgram();
      
	    gl.attachShader(objectPositionProgram, buildShader(gl, fillRectangleVertexShader, gl.VERTEX_SHADER));
	    gl.attachShader(objectPositionProgram, buildShader(gl, objectPositionFragmentShader, gl.FRAGMENT_SHADER));
	    gl.linkProgram(objectPositionProgram);

	    if (!gl.getProgramParameter(objectPositionProgram, gl.LINK_STATUS)) {
	      throw new Error("Failed to initialise shaders");
	    }

      objectPositionProgram.vertexPositionAttribute = gl.getAttribLocation(objectPositionProgram, "aVertexPosition");
      objectPositionProgram.objectMapSizeUniform = gl.getUniformLocation(objectPositionProgram, "uObjectMapSize");
      objectPositionProgram.objectPositionMapUniform = gl.getUniformLocation(objectPositionProgram, "uObjectPositionMap");
      objectPositionProgram.objectVelocityMapUniform = gl.getUniformLocation(objectPositionProgram, "uObjectVelocityMap");
	    this.objectPositionProgram = objectPositionProgram;
      
      //
      // Build main shader
      //
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
      this.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
	    this.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");      
      this.objectIndexAttribute = gl.getAttribLocation(program, "aObjectIndex");      
      this.objectPositionMapUniform = gl.getUniformLocation(program, "uObjectPositionMap");
      
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