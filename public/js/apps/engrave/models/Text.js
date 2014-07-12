define(['./Polygon', './Primitives', '../assets', 'gl-matrix'], function(Polygon, Primitives, assets, glm) {
  
  var cache = {};
  
  return {
    char : function(char, depth) {
      var cached = cache[char];
      if (cached) {
        return cached;
      }
      
      var def = assets.text[char];
      if (typeof def === 'undefined') {
        return null;
      }
      
      // Calculate the height of the text in the original text vector
      var bottom = 9007199254740992, top = -bottom, left = bottom, right = top;
      for (var i = 0; i < def.base.length; i++) {
        var vertices = def.base[i];
        for (var j = 0; j < vertices.length; j++) {
          var pos = vertices[j];
          if (pos[0] < left) {
            left = pos[0];
          }
          if (pos[0] > right) {
            right = pos[0];
          }
          if (pos[1] < bottom) {
            bottom = pos[1];
          }
          if (pos[1] > top) {
            top = pos[1];
          }          
        }
      }
      
      // Scale the vertices to make the height of text 5.0
      var scale = 5.0 / (top - bottom);
      var width = (right - left) * scale;
      // Create prism from the first 'base' polygons
      var vertices = def.base[0].map(function(pos) {
        return [pos[0] * scale, pos[1] * scale, 0.0];
      });

      var charSolid = Primitives.prism(Polygon.fromVertices(vertices), depth);
      
      // Union other 'base' prisms
      if (def.base.length > 1) {
        for (var i = 1; i < def.base.length; i++) {
          vertices = def.base[i].map(function(pos) {
            return [pos[0] * scale, pos[1] * scale, 0.0];
          });
          
          charSolid = charSolid.union(Primitives.prism(Polygon.fromVertices(vertices), depth));
        }
      }
      
      // Substract prisms from 'subtract' polygons
      if (def.subtract) {
        for (var i = 0; i < def.subtract.length; i++) {
          vertices = def.subtract[i].map(function(pos) {
            return [pos[0] * scale, pos[1] * scale, 0.1];
          });
          
          charSolid = charSolid.subtract(Primitives.prism(Polygon.fromVertices(vertices), depth + 0.2));
        }
      }
      
      // Union other prisms from 'union' polygons
      if (def.union) {
        for (var i = 0; i < def.union.length; i++) {
          vertices = def.union[i].map(function(pos) {
            return [pos[0] * scale, pos[1] * scale, 0.0];
          });
          
          charSolid = charSolid.union(Primitives.prism(Polygon.fromVertices(vertices), depth));
        }
      }      
      
      charSolid.width = width;
      cache[char] = charSolid;
      return charSolid;
    },
    
    string: function(str, depth, spacing) {
      if (typeof spacing === 'undefined') {
        spacing = 0.8;
      }
      
      var width = 0;
      var strSolid = null;
      
      for (var i = 0; i < str.length; i++) {
        var char = str[i];
        if (char === ' ') {
          // Space
          width += (2.0 + spacing);
        }
        
        var charSolid = this.char(char, depth);
        if (charSolid) {
          if (strSolid) {
            width += spacing;
          }
          
          var charWidth = charSolid.width;
          charSolid = charSolid.translate([width, 0.0, 0.0]);
          width += charWidth;
          
          strSolid = strSolid ? strSolid.union(charSolid) : charSolid;          
        }
      }
      
      if (strSolid) {
        strSolid.width = width;
      }
      
      return strSolid;
    }
  }
});