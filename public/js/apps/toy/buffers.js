define(['./assets'], function(assets) {
  return {
    init: function(gl) {
      var triangleVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(assets.triangleVertices), gl.STATIC_DRAW);
      
      triangleVertexPositionBuffer.itemSize = 3;
      triangleVertexPositionBuffer.numItems = 3;
      this.triangleVertexPosition = triangleVertexPositionBuffer;
      
      var squareVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(assets.squareVertices), gl.STATIC_DRAW);
      
      squareVertexPositionBuffer.itemSize = 3;
      squareVertexPositionBuffer.numItems = 4;
      this.squareVertexPosition = squareVertexPositionBuffer;
    }
  };
});