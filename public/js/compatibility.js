if (typeof window.requestAnimFrame === 'undefined') {
  window.requestAnimFrame = (function(){
    return  window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();  
}