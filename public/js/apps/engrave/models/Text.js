define(['./Polygon', './Primitives', 'text!../assets.json', 'gl-matrix'], function(Polygon, Primitives, assetsStr, glm) {
  
  var assets = JSON.parse(assetsStr);
  
  return {
    char : function(char, height) {
      var def = assets[char];
      
      // Create prism from the first 'base' polygons
      var vertices = def.base[0].map(function(pos) {
        return [pos[0], pos[1], 0.0];
      });
      var text = Primitives.prism(Polygon.fromVertices(vertices), height);
      
      // Union other 'base' prisms
      if (def.base.length > 1) {
        for (var i = 1; i < def.base.length; i++) {
          vertices = def.base[i].map(function(pos) {
            return [pos[0], pos[1], 0.0];
          });
          text = text.union(Primitives.prism(Polygon.fromVertices(vertices), height));
        }
      }
      
      // Substract prisms from 'subtract' polygons
      if (def.subtract) {
        for (var i = 0; i < def.subtract.length; i++) {
          vertices = def.subtract[i].map(function(pos) {
            return [pos[0], pos[1], 0.1];
          });
          
          text = text.subtract(Primitives.prism(Polygon.fromVertices(vertices), height + 0.2));
        }
      }
      
      // Union other prisms from 'union' polygons
      if (def.union) {
        for (var i = 0; i < def.union.length; i++) {
          vertices = def.union[i].map(function(pos) {
            return [pos[0], pos[1], 0.0];
          });
          
          text = text.union(Primitives.prism(Polygon.fromVertices(vertices), height));
        }
      }
      
      return text;
    }
  }
});