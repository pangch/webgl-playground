define(['./utils', 'jquery', 'text!./assets.json'], function(utils, $, assets) {

  var floorImage = null;
  var wallImage = null;
  
  var heightMap;
  var worldWidth, worldHeight;
  
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
    
    initWithWorld: function(gl, world) {
      heightMap = world.heightMap;
      worldHeight = heightMap.length;
      worldWidth = heightMap[0].length;
      
      this.objects = {};

      // Generate floor object, which is a simple square
      var floor = {
        vertices: [
          0.0, 0.0, 0.0,
          worldWidth, 0.0, 0.0,
          worldWidth, worldHeight, 0.0,
          0.0, worldHeight, 0.0
        ],
        textureCoords: [
          0.0, 0.0,
          worldWidth, 0.0,
          worldWidth, worldHeight,
          0.0, worldHeight
        ],
        indices: [0, 1, 2, 0, 2, 3]
      };
      this.objects.floor = utils.buildModelObject(gl, floor);
      this.objects.floor.texture = utils.buildTexture(gl, floorImage);
      
      // Generate walls
      var wallVertices = [], wallTextureCoords = [], wallIndices = [];
      var currentIndexCount = 0;
      for (var i = 0; i < worldWidth; i++) {
        for (var j = 0; j < worldHeight; j++) {
          if (heightMap[i][j] === 0) {
            continue;
          }
          
          // For each side
          var height = heightMap[i][j];
          if (i - 1 > 0 && heightMap[i - 1][j] < height) {
            wallVertices.push(i, j, 0, i, j + 1, 0, i, j + 1, height, i, j, height);
            wallTextureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            wallIndices.push(
              currentIndexCount, currentIndexCount + 1, currentIndexCount + 2, 
              currentIndexCount, currentIndexCount + 2, currentIndexCount + 3
            );
            currentIndexCount += 4;
          }
          if (j - 1 > 0 && heightMap[i][j - 1] < height) {
            wallVertices.push(i, j, 0, i + 1, j, 0, i + 1, j, height, i, j, height);
            wallTextureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            wallIndices.push(
              currentIndexCount, currentIndexCount + 1, currentIndexCount + 2, 
              currentIndexCount, currentIndexCount + 2, currentIndexCount + 3
            );
            currentIndexCount += 4;
          }
          if (i + 1 < worldWidth && heightMap[i + 1][j] < height) {
            wallVertices.push(i + 1, j, 0, i + 1, j + 1, 0, i + 1, j + 1, height, i + 1, j, height);
            wallTextureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            wallIndices.push(
              currentIndexCount, currentIndexCount + 1, currentIndexCount + 2, 
              currentIndexCount, currentIndexCount + 2, currentIndexCount + 3
            );
            currentIndexCount += 4;
          }
          if (j + 1 < worldHeight && heightMap[i][j + 1] < height) {
            wallVertices.push(i, j + 1, 0, i + 1, j + 1, 0, i + 1, j + 1, height, i, j + 1, height);
            wallTextureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            wallIndices.push(
              currentIndexCount, currentIndexCount + 1, currentIndexCount + 2, 
              currentIndexCount, currentIndexCount + 2, currentIndexCount + 3
            );
            currentIndexCount += 4;
          }
          
          // Top
          wallVertices.push(i, j, height, i + 1, j, height, i + 1, j + 1, height, i, j + 1, height);
          wallTextureCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
          wallIndices.push(
            currentIndexCount, currentIndexCount + 1, currentIndexCount + 2, 
            currentIndexCount, currentIndexCount + 2, currentIndexCount + 3
          );
          currentIndexCount += 4;
        }
      }
      this.objects.walls = utils.buildModelObject(gl, {
        vertices: wallVertices,
        textureCoords: wallTextureCoords,
        indices: wallIndices
      });
      this.objects.walls.texture = utils.buildTexture(gl, wallImage);
    },
    
    init: function(gl) {
      assets = JSON.parse(assets);
      this.initWithWorld(gl, assets.worlds.default);
    }
    
  };
});