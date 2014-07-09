define([], function() {
  return {
    EPSILON: 1e-6,
    
    floatSign: function(f) {
      return f < -this.EPSILON ? -1 : (f > this.EPSILON ? 1 : 0);
    }
  }
});