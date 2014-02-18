define([
    "Game/Client/View/DomController", 
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter"
],

function (DomController, Settings, Exception, NotificationCenter) {
    
    function AbstractView () {
    	this.me = null;
        this.canvas = null;
        this.debugMode = false;

        NotificationCenter.on("view/createMesh", this.createMesh, this);
        NotificationCenter.on("view/createAnimatedMesh", this.createAnimatedMesh, this);
        NotificationCenter.on("view/addMesh", this.addMesh, this);
        NotificationCenter.on("view/removeMesh", this.removeMesh, this);
        NotificationCenter.on("view/updateMesh", this.updateMesh, this);

        NotificationCenter.on("view/fullscreenChange", this.onFullscreenChange, this);
        NotificationCenter.on("view/toggleDebugMode", this.onToggleDebugMode, this);

        NotificationCenter.on("view/toggleInfo", this.onToggleInfo, this);

        NotificationCenter.on("view/createAndAddPlayerInfo", this.onCreateAndAddPlayerInfo, this);
        NotificationCenter.on("view/updatePlayerInfo", this.onUpdatePlayerInfo, this);
        NotificationCenter.on("view/removePlayerInfo", this.onRemovePlayerInfo, this);
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
    }

    AbstractView.prototype.loadPlayerMesh = function(player) {
        throw new Exception('Abstract Function loadPlayerMesh not overwritten');
    };

    AbstractView.prototype.loadMeshes = function(objects) {
    	throw new Exception('Abstract Function loadMeshes not overwritten');
    };

    AbstractView.prototype.render = function () {
    	throw new Exception('Abstract Function render not overwritten');
    }

    AbstractView.prototype.createMesh = function (texturePath, callback, options) {
    	throw new Exception('Abstract Function createMesh not overwritten');
    }

    AbstractView.prototype.createAnimatedMesh = function (texturePaths, callback, options) {
        throw new Exception('Abstract Function createAnimatedMesh not overwritten');
    }

    AbstractView.prototype.addMesh = function(mesh) {
        throw new Exception('Abstract Function addMesh not overwritten');
    };

    AbstractView.prototype.removeMesh = function(mesh) {
        throw new Exception('Abstract Function removeMesh not overwritten');
    };

    AbstractView.prototype.updateMesh = function(mesh, options) {
        throw new Exception('Abstract Function updateMesh not overwritten');
    };

    AbstractView.prototype.setMe = function(player) {
        this.me = player;
    };

    AbstractView.prototype.addPlayer = function(player) {
 		throw new Exception('Abstract Function addPlayer not overwritten');
    };

    AbstractView.prototype.removPlayer = function(player) {
    	throw new Exception('Abstract Function removPlayer not overwritten');
    };

    AbstractView.prototype.setCameraPosition = function (x, y) {
    	throw new Exception('Abstract Function setCameraPosition not overwritten');
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
    	throw new Exception('Abstract Function setCameraZoom not overwritten');
    };

    AbstractView.prototype.onFullscreenChange = function(isFullScreen) {

        if (!isFullScreen) {
            Settings.STAGE_WIDTH = 600;
            Settings.STAGE_HEIGHT = 400;
        } else {
            // FIXME: Create FIXME meme (dumb and dumber)
            // FIXME: don't overwrite Settings
            Settings.STAGE_WIDTH = window.innerWidth;
            Settings.STAGE_HEIGHT = window.innerHeight;
        }
    };

    AbstractView.prototype.onToggleDebugMode = function(debugMode) {
        if(debugMode) {
            this.setCameraPosition(-Settings.STAGE_WIDTH / 2, -Settings.STAGE_HEIGHT / 2);
        }

        this.debugMode = debugMode;
    };

    AbstractView.prototype.toggleInfo = function(show, string) {
        throw new Exception('Abstract Function showInfo not overwritten');
    };

    AbstractView.prototype.onCreateAndAddPlayerInfo = function(options) {
        throw new Exception('Abstract Function onCreateAndAddPlayerInfo not overwritten');
    };

    AbstractView.prototype.onUpdatePlayerInfo = function(playerInfo, options) {
        throw new Exception('Abstract Function onUpdatePlayerInfo not overwritten');
    };

    AbstractView.prototype.onRemovePlayerInfo = function(playerInfo) {
        throw new Exception('Abstract Function onRemovePlayerInfo not overwritten');
    };

    return AbstractView;
});