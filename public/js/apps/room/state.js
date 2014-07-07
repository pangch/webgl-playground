define(['gl-matrix'], function(glm) {
  
  var pitch = 0;
  var pitchRate = 0;
  
  var yaw = 0;
  var yawRate = 0;
  
  var joggingAngle = 0;
  
  var xPos = 5.0;
  var yPos = 5.0;
  var zPos = 0;
  
  var speed = 0;
  var horizontalSpeed = 0;
  
  var lastTime = null;
  
  var pressedKeys = {};
  
  var handleKeys = function() {
    if (pressedKeys[38]) {
      // Up
      pitchRate = 0.0006;
    } else if (pressedKeys[40]) {
      // Down
      pitchRate = -0.0006;
    } else {
      pitchRate = 0;
    }
    
    if (pressedKeys[37]) {
      // Left
      yawRate = 0.001;
    } else if (pressedKeys[39]) {
      // Right
      yawRate = -0.001;
    } else {
      yawRate = 0;
    }
    
    if (pressedKeys[87]) {
      // W
      speed = 0.001;
    } else if (pressedKeys[83]) {
      // S
      speed = -0.001;
    } else {
      speed = 0;
    }
    
    if (pressedKeys[65]) {
      // A
      horizontalSpeed = 0.001;
    } else if (pressedKeys[68]) {
      // D
      horizontalSpeed = -0.001;
    } else {
      horizontalSpeed = 0;
    }
  };
  
  return {
    handleKeyEvent: function(evt) {
      if ([37, 38, 39, 40, 65, 68, 83, 87].indexOf(evt.keyCode) !== -1) {
        if (evt.type === 'keydown') {
          pressedKeys[evt.keyCode] = true;
        } else if (evt.type === 'keyup') {
          pressedKeys[evt.keyCode] = false;
        }
        evt.preventDefault();
      }      
    },
    
    animate: function() {
      handleKeys();
      
      var now = new Date().getTime();
      if (lastTime) {
        var elapsed = now - lastTime;

        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;
        
        if (speed != 0) {
          xPos -= Math.sin(yaw) * speed * elapsed;
          yPos += Math.cos(yaw) * speed * elapsed;
        }
        
        if (horizontalSpeed != 0) {
          xPos -= Math.cos(yaw) * horizontalSpeed * elapsed;
          yPos -= Math.sin(yaw) * horizontalSpeed * elapsed;
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
      return [xPos, yPos, zPos + 0.2];
    }
    
  };
});