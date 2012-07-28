define([
    'Game/Config/Settings'
], 

function (Settings) {

    var requestAnimFrame =  (function (){

        var _setTimeout = function ( callback ){
            setTimeout(callback, Settings.BOX2D_TIME_STEP * 1000);
        }

        if (typeof window != 'undefined') {

            return  window.requestAnimationFrame       || 
                    window.webkitRequestAnimationFrame || 
                    window.mozRequestAnimationFrame    || 
                    window.oRequestAnimationFrame      || 
                    window.msRequestAnimationFrame     || 
                    _setTimeout;

        } else {
            return _setTimeout;
        }

    })();

    return requestAnimFrame;
});