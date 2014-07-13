define(['./scene', './camera', 'text!./dashboard.html'], function(scene, camera, dashboardHtml) {

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
      },
      
      getText: function() {
        return $('#engrave-text').val().toLowerCase().substring(0, 25);        
      },
      
      getDepth: function() {
        try {
          var depth = parseFloat($('#engrave-depth').val());
          if (depth < 1.0) {
            depth = 1.0;
          } else if (depth > 5.0) {
            depth = 5.0;
          }
          return depth;
        } catch (e) {
          return 2.0;
        }        
      },
      
      isConvex: function() {
        return $('#engrave-convex').is(':checked');
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
      return camera.handleKeyEvent(evt);
    }
	};
})