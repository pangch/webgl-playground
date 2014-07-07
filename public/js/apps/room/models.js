define(['./utils', 'jquery', 'text!./assets.json'], function(utils, $, assets) {

  var floorImage = null;
  var wallImage = null;
  
  assets = JSON.parse(assets);
  
  return {
    load: function(callback) {
      // Load texture images
      $.when(
        utils.loadImage('images/floor.jpg'),
        utils.loadImage('images/wall1.jpg'))
        .done(function(floor, wall) {
          floorImage = floor;
          wallImage = wall;
          
          callback();
        }).fail(function(err) {
          throw err;
        });
    },
    
    init: function(gl) {
      this.objects = {};
      
      // Load static objects
      if (assets.objects) {
        for (var name in assets.objects) {
          this.objects[name] = utils.buildModelObject(gl, assets.objects[name]);        
        }
        
        if (this.objects.floor) {
          this.objects.floor.texture = utils.buildTexture(gl, floorImage);
        }
        if (this.objects.walls) {
          this.objects.walls.texture = utils.buildTexture(gl, wallImage);
        }        
      }
      
    }
    
  };
});