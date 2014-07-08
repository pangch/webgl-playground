define(['./utils', 'jquery', 'text!./assets.json'], function(utils, $, assets) {

  var floorImage = null;
  var wallImage1 = null, wallImage2 = null, wallImage3 = null;
  
  var heightMap, textureMap;
  var worldWidth, worldHeight;
  
  return {
    load: function(callback) {
      // Load texture images
      $.when(
        utils.loadImage('images/floor.jpg'),
        utils.loadImage('images/wall1.jpg'),
        utils.loadImage('images/wall2.jpg'),
        utils.loadImage('images/wall3.jpg'))
        .done(function(floor, wall1, wall2, wall3) {
          floorImage = floor;
          wallImage1 = wall1;
          wallImage2 = wall2;
          wallImage3 = wall3;
          
          callback();
        }).fail(function(err) {
          throw err;
        });
    },
    
    getHeightMap: function() {
      return heightMap;
    },
    
    initWithWorld: function(gl, world) {
      heightMap = world.heightMap;
      textureMap = world.textureMap;
      worldHeight = heightMap.length;
      worldWidth = heightMap[0].length;
      
      this.objects = {};

      // Generate floor object, which is a simple square
      var floor = {
        vertices: [0.0, 0.0, 0.0, worldWidth, 0.0, 0.0, worldWidth, worldHeight, 0.0, 0.0, worldHeight, 0.0],
        textureCoords: [0.0, 0.0, worldWidth, 0.0, worldWidth, worldHeight, 0.0, worldHeight],
        normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        indices: [0, 1, 2, 0, 2, 3]
      };
      this.objects.floor = utils.buildModelObject(gl, floor);
      this.objects.floor.texture = utils.buildTexture(gl, floorImage);
      
      // Generate walls
      var walls = [
        { vertices:[], textureCoords: [], normals: [], indices: [] },
        { vertices:[], textureCoords: [], normals: [], indices: [] },
        { vertices:[], textureCoords: [], normals: [], indices: [] }
      ];
      var currentIndexes = [0, 0, 0];
      for (var i = 0; i < worldWidth; i++) {
        for (var j = 0; j < worldHeight; j++) {
          if (heightMap[i][j] === 0) {
            continue;
          }
          
          // For each side
          var height = heightMap[i][j];
          var wallNum = textureMap[i][j] - 1;
          if (i - 1 > 0 && heightMap[i - 1][j] < height) {
            walls[wallNum].vertices.push(i, j, 0, i, j + 1, 0, i, j + 1, height, i, j, height);
            walls[wallNum].normals.push(-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0);
            walls[wallNum].textureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            walls[wallNum].indices.push(
              currentIndexes[wallNum], currentIndexes[wallNum] + 1, currentIndexes[wallNum] + 2, 
              currentIndexes[wallNum], currentIndexes[wallNum] + 2, currentIndexes[wallNum] + 3
            );
            currentIndexes[wallNum] += 4;
          }
          if (j - 1 > 0 && heightMap[i][j - 1] < height) {
            walls[wallNum].vertices.push(i, j, 0, i + 1, j, 0, i + 1, j, height, i, j, height);
            walls[wallNum].normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0);
            walls[wallNum].textureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            walls[wallNum].indices.push(
              currentIndexes[wallNum], currentIndexes[wallNum] + 1, currentIndexes[wallNum] + 2, 
              currentIndexes[wallNum], currentIndexes[wallNum] + 2, currentIndexes[wallNum] + 3
            );
            currentIndexes[wallNum] += 4;
          }
          if (i + 1 < worldWidth && heightMap[i + 1][j] < height) {
            walls[wallNum].vertices.push(i + 1, j, 0, i + 1, j + 1, 0, i + 1, j + 1, height, i + 1, j, height);
            walls[wallNum].normals.push(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0);
            walls[wallNum].textureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            walls[wallNum].indices.push(
              currentIndexes[wallNum], currentIndexes[wallNum] + 1, currentIndexes[wallNum] + 2, 
              currentIndexes[wallNum], currentIndexes[wallNum] + 2, currentIndexes[wallNum] + 3
            );
            currentIndexes[wallNum] += 4;
          }
          if (j + 1 < worldHeight && heightMap[i][j + 1] < height) {
            walls[wallNum].vertices.push(i, j + 1, 0, i + 1, j + 1, 0, i + 1, j + 1, height, i, j + 1, height);
            walls[wallNum].normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
            walls[wallNum].textureCoords.push(0, 0, 1, 0, 1, height, 0, height);
            walls[wallNum].indices.push(
              currentIndexes[wallNum], currentIndexes[wallNum] + 1, currentIndexes[wallNum] + 2, 
              currentIndexes[wallNum], currentIndexes[wallNum] + 2, currentIndexes[wallNum] + 3
            );
            currentIndexes[wallNum] += 4;
          }
          
          // Top
          walls[wallNum].vertices.push(i, j, height, i + 1, j, height, i + 1, j + 1, height, i, j + 1, height);
          walls[wallNum].normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
          walls[wallNum].textureCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
          walls[wallNum].indices.push(
            currentIndexes[wallNum], currentIndexes[wallNum] + 1, currentIndexes[wallNum] + 2, 
            currentIndexes[wallNum], currentIndexes[wallNum] + 2, currentIndexes[wallNum] + 3
          );
          currentIndexes[wallNum] += 4;
        }
      }
      this.objects.walls = [
        utils.buildModelObject(gl, walls[0]),
        utils.buildModelObject(gl, walls[1]),
        utils.buildModelObject(gl, walls[2])
      ];
      this.objects.walls[0].texture = utils.buildTexture(gl, wallImage1);
      this.objects.walls[1].texture = utils.buildTexture(gl, wallImage2);
      this.objects.walls[2].texture = utils.buildTexture(gl, wallImage3);
    },
    
    init: function(gl) {
      assets = JSON.parse(assets);
      this.initWithWorld(gl, assets.worlds.default);
    }
    
  };
});