define(['./scene', './models', './state'], function(scene, models, state) {

	var initGL = function(canvas) {
    var gl = canvas.get(0).getContext("experimental-webgl");      
    
    if (!gl) {
      throw "Failed to initialize WebGL.";
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
      models.load(callback);
    },

		run: function(canvas, dashboard) {
      dashboard.addClass('light');
      
      scene.init(initGL(canvas), initParams(canvas));
      scene.run();
		},
    
    exit: function() {
      scene.exit();
    },
    
    handleKeyEvent: function(evt) {
      return state.handleKeyEvent(evt);
    }
	};
})