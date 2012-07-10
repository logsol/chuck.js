define(['Chuck/Settings'], function(Settings) {

	var requestAnimFrame =  (function(){
      return window.requestAnimationFrame       || 
             window.webkitRequestAnimationFrame || 
             window.mozRequestAnimationFrame    || 
             window.oRequestAnimationFrame      || 
             window.msRequestAnimationFrame     || 
             function( callback ){
                setTimeout(callback, Settings.BOX2D_TIME_STEP * 1000);
             };
    })();

	return requestAnimFrame;
});