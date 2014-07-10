define(['./models/BSPTree',
        './models/Plane',
        './models/Polygon',
        './models/Solid',
        './models/Primitives'], 
  function(BSPTree, 
           Plane,
           Polygon,
           Solid,
           Primitives) {

  return {
    BSPTree: BSPTree,
    Plane: Plane,
    Polygon: Polygon,
    Solid: Solid,
    Primitives: Primitives
  };
  
});