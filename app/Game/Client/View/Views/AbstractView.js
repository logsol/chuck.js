define([
    "Game/Client/View/DomController", 
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Game/Core/NotificationCenter"
],

function (DomController, Settings, Exception, NotificationCenter) {
    
    function AbstractView () {
    	this.me = null;
        this.canvas = null;

        NotificationCenter.on("view/createMesh", this.createMesh, this);
        NotificationCenter.on("view/addMesh", this.addMesh, this);
        NotificationCenter.on("view/updateMesh", this.updateMesh, this);
        NotificationCenter.on("view/createAnimatedMesh", this.createAnimatedMesh, this);
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
        throw new Exception('Abstract Function loadPlayerMesh not overwritten ');
    };

    AbstractView.prototype.loadMeshes = function(objects) {
    	throw new Exception('Abstract Function loadMeshes not overwritten ');
    };

    AbstractView.prototype.render = function () {
    	throw new Exception('Abstract Function render not overwritten ');
    }

    AbstractView.prototype.createMesh = function (texturePath, callback, options) {
    	throw new Exception('Abstract Function createMesh not overwritten ');
    }

    AbstractView.prototype.addMesh = function(mesh) {
        throw new Exception('Abstract Function addMesh not overwritten ');
    };

    AbstractView.prototype.updateMesh = function(mesh, options) {
        throw new Exception('Abstract Function updateMesh not overwritten ');
    };

    AbstractView.prototype.createAnimatedMesh = function (texturePaths, callback, options) {
        throw new Exception('Abstract Function createAnimatedMesh not overwritten ');
    }

    AbstractView.prototype.setMe = function(player) {
        this.me = player;
    };

    AbstractView.prototype.addPlayer = function(player) {
 		throw new Exception('Abstract Function addPlayer not overwritten ');
    };

    AbstractView.prototype.removPlayer = function(player) {
    	throw new Exception('Abstract Function removPlayer not overwritten ');
    };

    AbstractView.prototype.setCameraPosition = function (x, y) {
    	throw new Exception('Abstract Function setCameraPosition not overwritten ');
    }

    AbstractView.prototype.calculateCameraPosition = function() {
        var reference = this.me.getPosition();
        var pos = {};

        pos.x = reference.x;
        pos.y = reference.y;

        pos.x = pos.x * Settings.RATIO;
        pos.y = -(pos.y * Settings.RATIO);

        pos.x += this.me.playerController.xyInput.x * Settings.STAGE_WIDTH / 4;
        pos.y += this.me.playerController.xyInput.y * Settings.STAGE_HEIGHT / 4;

        return pos;
    };

    AbstractView.prototype.setCameraZoom = function (z) {
    	throw new Exception('Abstract Function setCameraZoom not overwritten ');
    }

    // TODO Move to Level
    AbstractView.prototype.tileAtPositionExists = function(objects, x, y) {

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            if(o.x == x && o.y == y) return true;
        }
        return false;
    };


    return AbstractView;
});