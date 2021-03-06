define(['./scene', './assets', './camera', 'text!./dashboard.html'], function(scene, assets, camera, dashboardHtml) {

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