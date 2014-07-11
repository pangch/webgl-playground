define(['./Polygon', './Primitives', 'text!../assets.json', 'gl-matrix'], function(Polygon, Primitives, assetsStr, glm) {
  
  var assets = JSON.parse(assetsStr);
  
  return {
    char : function(char, height) {
      var def = assets[char];
      
      // Create prism from 'out' rectangle
      var vertices = def.out.map(function(pos) {
        return [pos[0], pos[1], 0.0];
      });
      var text = Primitives.prism(Polygon.fromVertices(vertices), height);
      
      // Substract prisms from 'in' rectangles
      if (def.in) {
        for (var i = 0; i < def.in.length; i++) {
          vertices = def.in[i].map(function(pos) {
            return [pos[0], pos[1], 0.1];
          });
          
          text = text.subtract(Primitives.prism(Polygon.fromVertices(vertices), height + 0.2));
        }
      }
      
      return text;
    }
  }
});