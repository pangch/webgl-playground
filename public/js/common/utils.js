define([], function() {
	return {
		buildShader: function(gl, source, type) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  	throw gl.getShaderInfoLog(shader);
			}

			return shader;
		}
	}
});