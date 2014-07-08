define(['gl-matrix'], function(glm) {
    
  var pos = glm.vec3.fromValues(5, 5, 0);     // Current position  
  var cameraDir = glm.vec2.fromValues(0, 1);  // Camera direction vector in 2D, initial value is [sin(0), cos(0)]
  
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
      speed = 0.003;
    } else if (pressedKeys[83]) {
      // S
      speed = -0.003;
    } else {
      speed = 0;
    }
    
    if (pressedKeys[65]) {
      // A
      horizontalSpeed = 0.003;
    } else if (pressedKeys[68]) {
      // D
      horizontalSpeed = -0.003;
    } else {
      horizontalSpeed = 0;
    }
    
    if (pressedKeys[32]) {
      // Space
      if (jumpSpeed == 0) {
        jumpSpeed = 0.004;
      }
    }
  };
  
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
        
        if (yawSpeed != 0) {
          // Yaw changed
          glm.vec2.set(cameraDir, Math.sin(-yaw), Math.cos(yaw));
        }
        
        var posDiff = [0, 0, 0];
        if (speed != 0) {
          var dist = speed * elapsed;
          posDiff[0] += cameraDir[0] * dist;
          posDiff[1] += cameraDir[1] * dist;
        }
        
        if (horizontalSpeed != 0) {
          var horizontalDir = [-cameraDir[1], cameraDir[0]];
          var dist = horizontalSpeed * elapsed;
          posDiff[0] += horizontalDir[0] * dist;
          posDiff[1] += horizontalDir[1] * dist;
        }
        if (jumpSpeed != 0) {
          if (jumpSpeed > 0 && pos[2] >= 1.4) {
            jumpSpeed = -jumpSpeed;            
          } else if (jumpSpeed < 0 && pos[2] <= 0) {
            jumpSpeed = 0;
            pos[2] = 0;
          } else {
            posDiff[2] += jumpSpeed * elapsed;
          }
        } else if (speed != 0 || horizontalSpeed != 0) {
          // Apply jogging height variation
          joggingAngle += elapsed * 0.015;
          pos[2] = Math.sin(joggingAngle) / 160;
        }
        
        // Apply position change
        glm.vec3.add(pos, pos, posDiff);
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
    }
    
  };
});