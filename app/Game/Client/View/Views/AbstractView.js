define([
    "Game/Client/View/DomController", 
    "Game/Config/Settings"
],

function (DomController, Settings) {
    
    function AbstractView () {
    	this.me = null;
        this.canvas = null;
    }

    AbstractView.prototype.isWebGlEnabled = function () { 
        try { 
            return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
        } catch(e) { 
            return false; 
        } 
    }

    AbstractView.prototype.setCanvas = function (canvas) {

    	this.canvas = canvas;
        DomController.setCanvas(canvas);

        if(Settings.DEBUG_MODE) {
            DomController.createDebugCanvas();
        }
    }

    AbstractView.prototype.loadPlayerMesh = function(player) {
        throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    };

    AbstractView.prototype.loadMeshes = function(objects) {
    	throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    };

    AbstractView.prototype.render = function () {
    	throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    }

    AbstractView.prototype.createMesh = function (width, height, x, y, imgPath, callback) {
    	throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    }

    AbstractView.prototype.setMe = function(player) {
        this.me = player;
    };

    AbstractView.prototype.addPlayer = function(player) {
 		throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    };

    AbstractView.prototype.removPlayer = function(player) {
    	throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    };

    AbstractView.prototype.setCameraPosition = function (x, y) {
    	throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    }

    AbstractView.prototype.setCameraZoom = function (z) {
    	throw new Exception('Abstract Function not overwritten ' + arguments.callee.toString());
    }


    return AbstractView;
});