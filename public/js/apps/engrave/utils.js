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
    
    drawAxis: function(gl) {
      
    }
	}
});