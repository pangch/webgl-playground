define(['./world', 'gl-matrix'], function(world, glm) {
  var CLOSEST_DISTANCE = 0.2;
  
  var pos = glm.vec3.fromValues(5, 5, 0);     // Current position  
  var cameraDir = glm.vec3.fromValues(0, 1, 0);  // Camera direction vector, initial value is [sin(0), cos(0), sin(0)]
  
  var pitch = 0;
  var pitchSpeed = 0;
  
  var yaw = 0;
  var yawSpeed = 0;
  
  var speed = 0;
  var horizontalSpeed = 0;
  
  var joggingAngle = 0;
  var jumpSpeed = 0;
  
  var lastTime = null;
  
  var pressedKeys = {};
  
  var handleKeys = function() {
    if (pressedKeys[38]) {
      // Up
      pitchSpeed = 0.0006;
    } else if (pressedKeys[40]) {
      // Down
      pitchSpeed = -0.0006;
    } else {
      pitchSpeed = 0;
    }
    
    if (pressedKeys[37]) {
      // Left
      yawSpeed = 0.001;
    } else if (pressedKeys[39]) {
      // Right
      yawSpeed = -0.001;
    } else {
      yawSpeed = 0;
    }
    
    if (pressedKeys[87]) {
      // W
      speed = 0.002;
    } else if (pressedKeys[83]) {
      // S
      speed = -0.002;
    } else {
      speed = 0;
    }
    
    if (pressedKeys[65]) {
      // A
      horizontalSpeed = 0.002;
    } else if (pressedKeys[68]) {
      // D
      horizontalSpeed = -0.002;
    } else {
      horizontalSpeed = 0;
    }
    
    if (pressedKeys[32]) {
      // Space
      if (jumpSpeed == 0) {
        jumpSpeed = 0.002;
      }
    }
  };
  
  var isCollision = function(posX, posY, dir, speed) {
    var oldPosX = Math.floor(posX), oldPosY = Math.floor(posY);
    var dirSign = [Math.sign(dir[0]), Math.sign(dir[1])];
    if (speed < 0) {
      dirSign[0] = -dirSign[0];
      dirSign[1] = -dirSign[1];
    }
    posX += dirSign[0] * CLOSEST_DISTANCE;
    posY += dirSign[1] * CLOSEST_DISTANCE;
    posX = Math.floor(posX);
    posY = Math.floor(posY);
    var heightMap = world.getHeightMap();
    return heightMap[oldPosX][posY] > 0 || heightMap[posX][oldPosY] > 0;
  }
  
  return {
    handleKeyEvent: function(evt) {
      if ([32, 37, 38, 39, 40, 65, 68, 83, 87].indexOf(evt.keyCode) !== -1) {
        if (evt.type === 'keydown') {
          pressedKeys[evt.keyCode] = true;
        } else if (evt.type === 'keyup') {
          pressedKeys[evt.keyCode] = false;
        }
        evt.preventDefault();
      }
      return true;
    },
    
    animate: function() {
      handleKeys();
      
      var now = new Date().getTime();
      if (lastTime) {
        var elapsed = now - lastTime;

        yaw += yawSpeed * elapsed;
        pitch += pitchSpeed * elapsed;
        
        if (yawSpeed != 0 || pitchSpeed != 0) {
          // Bound pitch
          if (pitch > 1.0) {
            pitch = 1.0;
          } else if (pitch < -1.0) {
            pitch = -1.0;
          }
          
          // Yaw changed
          glm.vec3.set(cameraDir, Math.sin(-yaw), Math.cos(yaw), Math.sin(pitch));
        }
        
        if (speed != 0) {
          var dist = speed * elapsed;
          
          var newX = pos[0] + cameraDir[0] * dist;
          var newY = pos[1] + cameraDir[1] * dist;
          
          if (!isCollision(newX, newY, cameraDir, speed)) {
            pos[0] = newX;
            pos[1] = newY;
          }          
        }
        
        if (horizontalSpeed != 0) {
          var horizontalDir = [-cameraDir[1], cameraDir[0]];
          var dist = horizontalSpeed * elapsed;
          
          var newX = pos[0] + horizontalDir[0] * dist;
          var newY = pos[1] + horizontalDir[1] * dist;
          
          if (!isCollision(newX, newY, horizontalDir, horizontalSpeed)) {
            pos[0] = newX;
            pos[1] = newY;
          }
        }
        
        if (jumpSpeed != 0) {
          if (jumpSpeed > 0 && pos[2] >= 0.8) {
            jumpSpeed = -jumpSpeed;            
          } else if (jumpSpeed < 0 && pos[2] <= 0) {
            jumpSpeed = 0;
            pos[2] = 0;
          } else {
            pos[2] += jumpSpeed * elapsed;
          }
        } else if (speed != 0 || horizontalSpeed != 0) {
          // Apply jogging height variation
          joggingAngle += elapsed * 0.015;
          pos[2] = Math.sin(joggingAngle) / 160;
        }        
      }
      
      lastTime = now;
    },
    
    getPitch: function() {
      return pitch;
    },
    
    getYaw: function() {
      return yaw;
    },
    
    getPosition: function() {
      var currentPos = glm.vec3.clone(pos);
      // Adjust for player's height
      glm.vec3.add(currentPos, currentPos, [0, 0, 0.5]);
      
      return currentPos;
    },
    
    getCameraDirection: function() {
      return glm.vec3.clone(cameraDir);
      glm.vec3.normalize(dir, dir);
      return dir;
    }
    
  };
});