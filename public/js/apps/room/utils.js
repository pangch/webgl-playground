define(['jquery'], function($) {
	return {    
    loadImage: function(path) {
      var deferred = new $.Deferred();
      var image = new Image();
      image.onload = function() {
        deferred.resolve(image);
      }
      image.onerror = function() {
        deferred.reject('Failed to load image at ' + path);
      }

      image.src = path;
      return deferred.promise();
    },
    
    // Create a shader from source
		buildShader: function(gl, source, type) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  	throw gl.getShaderInfoLog(shader);
			}

			return shader;
		},
    
    // Create GL texture from an image
    buildTexture: function(gl, image) {
      var texture = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.bindTexture(gl.TEXTURE_2D, null);
      
      return texture;
    },
    
    // Create an object of GL array buffers from a model
    buildModelObject: function(gl, model) {
      var obj = {};
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
      obj.vertices = buffer;
      obj.vertexCount = model.vertices.length / 3;
      if (model.normals) {
        var normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
        obj.normals = normalsBuffer;
      }
      
      if (model.textureCoords) {
        var textCoordsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
        obj.textureCoords = textCoordsBuffer;
      }
      
      if (model.indices) {
        var indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
        obj.indices = indicesBuffer;
        obj.indexCount = model.indices.length;
      }
      
      return obj;      
    }
	}
});