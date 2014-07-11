define(['./models/BSPTree',
        './models/Plane',
        './models/Polygon',
        './models/Solid',
        './models/Primitives',
        './models/Text'], 
  function(BSPTree, 
           Plane,
           Polygon,
           Solid,
           Primitives,
           Text) {

  return {
    BSPTree: BSPTree,
    Plane: Plane,
    Polygon: Polygon,
    Solid: Solid,
    Primitives: Primitives,
    Text: Text
  };
  
});