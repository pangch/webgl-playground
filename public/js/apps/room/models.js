define(['common/utils', 'jquery', 'text!./assets.json'], function(utils, $, assets) {

  var floorImage = null;
  var wallImage = null;
  
  assets = JSON.parse(assets);
  
  return {
    load: function(callback) {
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
      
      for (var name in assets) {
        this.objects[name] = utils.buildModelObject(gl, assets[name]);        
      }
      
      this.objects.floor.texture = utils.buildTexture(gl, floorImage);
      // this.objects.walls.texture = utils.buildTexture(gl, wallImage);      
    }
    
  };
});