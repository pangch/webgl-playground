define(['./scene', './assets', './camera', 'text!./dashboard.html', 'browser'], function(scene, assets, camera, dashboardHtml, browser) {

	var initGL = function(canvas) {
    var gl = canvas.get(0).getContext("experimental-webgl");      
    if (!gl) {
      throw new Error("Failed to initialize WebGL.");
    }
    return gl;
  };
  
  var initParams = function(canvas) {
    return {
      getViewportWidth: function() {
        return canvas.width();
      },
      getViewportHeight: function() {
        return canvas.height();
      }
    };
  }

	return {
    load: function(callback) {
      debugger;
      if (!browser.safari) {
        alert(
          'You may encounter problems running this demo in ' + browser.name +
          '. Please run it in Safari 7 if possible.');
      }
      
      callback();
    },

		run: function(canvas, dashboard) {
      dashboard.addClass('light');
      dashboard.removeClass('hidden');
      dashboard.html(dashboardHtml);
      
      scene.init(initGL(canvas), initParams(canvas));
      scene.run();
		},
    
    exit: function() {
      scene.exit();
    },
    
    handleKeyEvent: function(evt) {
      return camera.handleKeyEvent(evt) && scene.handleKeyEvent(evt);
    }
	};
})