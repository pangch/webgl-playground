requirejs.config({
  baseUrl: 'js/lib',
  paths: {
    apps: '../apps',
    common: '../common'
  }
});

requirejs(['jquery', 'spin'], function($, Spinner) {
  
  var currentApp = null;
  
  var updateCanvasSize = function() {
    // It is necessary to set width and height as attribute
    // on canvas element. Setting them on style or in css
    // does not change the coordinate system of canvas.
    if (currentApp) {
      var canvas = $('div.canvas canvas');
      canvas.attr('width', $(window).width());
      canvas.attr('height', $(window).height());
    }
  };
  
  var launchApp = function(appName) {
    var canvasContainer = $('div.canvas');
    canvasContainer.addClass('active');
    
    canvas = canvasContainer.children('canvas');
    
    var dashboard = $('div.dashboard');
    dashboard.addClass('active hidden');
    dashboard.removeClass('dark light');
    dashboard.html('');

    requirejs(['apps/' + appName + '/app'], function(app) {
      // Create a new object instance to represent this app so that we can store status
      // of the app on the object
      app = $.extend({
        loaded: false,
        aborted: false
      }, app);
      
      currentApp = app;
      updateCanvasSize();
      
      var info = canvasContainer.children('.info');
      var spinner = null;
      
      // Show a spinner after delay if the app is not loaded yet.
      if (!app.loaded && !app.aborted) {
        spinner = new Spinner({ width: 2, color: '#333' }).spin();
        info.html(spinner.el);
      }
      
      try {
        // Launch app after loading
        app.load(function() {
          if (spinner) {
            spinner.stop();
          }
          
          if (app.aborted) {
            return;
          }
          app.loaded = true;
          app.run(canvas, dashboard);
        });
      } catch (e) {
        if (spinner) {
          spinner.stop();
        } else {
          clearTimeout(spinnerTimer);
        }
        
        canvas.addClass('error');
        info.html(e.message + '<br/><br/>' + e.stack.replace(/(?:\r\n|\r|\n)/g, '<br />'));
        info.addClass('error');
      }    
    });
  };
  
  var tearDownApp = function(app) {
    if (app.loaded) {
      app.exit();
    } else {
      app.aborted = true;
    }
    
    // Clear the old canvas and dashboard
    var canvasContainer = $('div.canvas');
    canvasContainer.removeClass('active');
    canvasContainer.children('canvas').remove();
    canvasContainer.prepend($('<canvas></canvas>'));
    
    var info = canvasContainer.children('.info');
    info.html('');
    info.removeClass('error');
        
    var dashboard = $('div.dashboard');
    dashboard.removeClass('active');
    dashboard.removeClass('dark light');
    dashboard.html('');
  };
  
  // Let the active app handle key event first, and then run generic handler
  var handleKeyEvent = function(evt) {
    if (currentApp === null) {
      return;
    }

    if (currentApp.handleKeyEvent) {
      if (!currentApp.handleKeyEvent(evt)) {
        return;
      }
    }
    
    if (evt.type === 'keydown') {
      // Press '/' to toggle dashboard
      if (!evt.shiftKey && evt.keyCode === 191) {
        $('div.dashboard').toggleClass('hidden');
      }
      
      // Press 'ESC' to exit
      if (evt.keyCode === 27) {
        tearDownApp(currentApp);
        currentApp = null;
      }
    }
  };
  
  // Document initialization
  $(document).ready(function() {    
    // Setup actions on app links
    $('.app-menu a[data-app]').each(function() {
      var self = $(this);
      self.on('click', function() {
        launchApp(self.attr('data-app'));
      })    
    });
    
    // Update canvas size on resize
    $(window).resize(function() {
      updateCanvasSize();
    });
    
    $(document).keyup(function(evt) {
      if (typeof evt.type === 'undefined') {
        evt.type = 'keyup';
      }
      handleKeyEvent(evt);
    });
    
    $(document).keydown(function(evt) {
      if (typeof evt.type === 'undefined') {
        evt.type = 'keydown';
      }
      handleKeyEvent(evt);
    });
  });  
});