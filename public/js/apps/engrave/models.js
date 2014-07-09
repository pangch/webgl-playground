define(['./models/BSPTree',
        './models/Plane',
        './models/Polygon',
        './models/Solid'], 
  function(BSPTree, 
           Plane,
           Polygon,
           Solid) {

  return {
    BSPTree: BSPTree,
    Plane: Plane,
    Polygon: Polygon,
    Solid: Solid
  };
  
});