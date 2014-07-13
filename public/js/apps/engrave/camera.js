define(['gl-matrix'], function(glm) {
  var xRot = 0;
  var xSpeed = 0;

  var yRot = 0;
  var ySpeed = 0;
  
  var zPos = -10.0;
  var zSpeed = 0;
  
  var lastTime = null;
  
  var pressedKeys = {};
  
  var handleKeys = function() {
    if (pressedKeys[38]) {
      // Up
      ySpeed = 0.001;
    } else if (pressedKeys[40]) {
      // Down
      ySpeed = -0.001;
    } else {
      ySpeed = 0;
    }
    
    if (pressedKeys[37]) {
      // Left
      xSpeed = 0.001;
    } else if (pressedKeys[39]) {
      // Right
      xSpeed = -0.001;
    } else {
      xSpeed = 0;
    }
    
    if (pressedKeys[219]) {
      // [
      zSpeed = 0.05;
    } else if (pressedKeys[221]) {
      // ]
      zSpeed = -0.05;
    } else {
      zSpeed = 0;
    }
  };
  
  return {
    handleKeyEvent: function(evt) {
      if ([37, 38, 39, 40, 219, 221].indexOf(evt.keyCode) !== -1) {
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

        xRot += xSpeed * elapsed;
        yRot += ySpeed * elapsed;
        zPos += zSpeed * elapsed;
      }
      
      lastTime = now;
    },
    
    getXRot: function() {
      return xRot;
    },
    
    getYRot: function() {
      return yRot;
    },
    
    getZPos: function() {
      return zPos;
    }
  };
});