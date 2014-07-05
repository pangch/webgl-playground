requirejs.config({
  baseUrl: 'js/lib',
  paths: {
    apps: '../apps',
    common: '../common'
  }
});

requirejs(['jquery'], function($) {
  var canvas = null;
  
  var launchApp = function(appName) {
    var canvasContainer = $('div.canvas');
    canvasContainer.addClass('active');
    
    canvas = canvasContainer.children('canvas');
    updateCanvasSize();
    
    var info = canvasContainer.children('.info');
    info.html('');
    info.removeClass('error');

    var dashboard = $('div.dashboard');
    dashboard.addClass('active');
    dashboard.removeClass('dark light');
    dashboard.html('');

    requirejs(['apps/' + appName + '/app'], function(app) {
      try {
        app.load(function() {
          app.run($("div.canvas canvas"), dashboard);
        });
      } catch (e) {
        canvas.addClass('error');
        
        info.text(e);
        info.addClass('error');
      }      
    });
  };
  
  var updateCanvasSize = function() {
    // It is necessary to set width and height as attribute
    // on canvas element. Setting them on style or in css
    // does not change the coordinate system of canvas.
    if (canvas) {
      canvas.attr('width', $(window).width());
      canvas.attr('height', $(window).height());
    }
  }

  $(document).ready(function() {
    
    // Setup actions on app links
    $('#app-menu a[data-app]').each(function() {
      var self = $(this);
      self.on('click', function() {
        launchApp(self.attr('data-app'));
      })    
    });
  
    // Update canvas size on resize
    $(window).resize(function() {
      updateCanvasSize();
    });
  });  
});