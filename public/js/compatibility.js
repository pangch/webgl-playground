window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function(callback, element){
           return window.setTimeout(callback, 1000 / 60);
         };
})();

window.cancelRequestAnimFrame = (function() {
  return window.cancelAnimationFrame               ||
         window.webkitCancelRequestAnimationFrame  ||
         window.mozCancelRequestAnimationFrame     ||
         window.oCancelRequestAnimationFrame       ||
         window.msCancelRequestAnimationFrame      ||
         clearTimeout
})();

Math.sign = (function() {
  return Math.sign ||
      function(x) {
        if (x > 0) {
          return 1;
        } else if (x < 0) { 
          return -1;
        } else {
          return 0;
        }
      };
})();