define(['./assets'], function(assets) {
  return {
    init: function(gl) {
      var triangleVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(assets.triangleVertices), gl.STATIC_DRAW);
      
      triangleVertexPositionBuffer.itemSize = 3;
      triangleVertexPositionBuffer.numItems = 3;
      this.triangleVertexPosition = triangleVertexPositionBuffer;
      
      var triangleIndicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW);
      
      triangleIndicesBuffer.itemSize = 1;
      triangleIndicesBuffer.numItems = 3;
      this.triangleIndices = triangleIndicesBuffer;            
      
      var squareVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(assets.squareVertices), gl.STATIC_DRAW);
      
      squareVertexPositionBuffer.itemSize = 3;
      squareVertexPositionBuffer.numItems = 4;
      this.squareVertexPosition = squareVertexPositionBuffer;
    }
  };
});