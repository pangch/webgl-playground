define(function() {
	return {
    drawAxis: function(gl, shader) {
      var vertices = [
          0.0,   0.0,   0.0,
        500.0,   0.0,   0.0,
          0.0,   0.0,   0.0,
          0.0, 500.0,   0.0,
          0.0,   0.0,   0.0,
          0.0,   0.0, 500.0
      ];
    
      var verticesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
      var normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0
      ];
    
      var normalsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
          
      var colors = [
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0
      ];
    
      var colorsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);      
      
      gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
      gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
      gl.vertexAttribPointer(shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
      gl.vertexAttribPointer(shader.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
      
      gl.disableVertexAttribArray(shader.objectIndexAttribute);
      gl.vertexAttrib2f(shader.objectIndexAttribute, 0.0, 0.0);
            
      gl.lineWidth(1.0);
      gl.drawArrays(gl.LINES, 0, 6);
      
      gl.enableVertexAttribArray(shader.objectIndexAttribute);
      
      gl.deleteBuffer(colorsBuffer);
      gl.deleteBuffer(verticesBuffer);
      gl.deleteBuffer(normalsBuffer);
    }
	}
});