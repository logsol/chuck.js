define([
    "Game/Client/View/DomController", 
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter"
],

function (DomController, Settings, Exception, Nc) {
    
    function AbstractView () {
    	this.me = null;
        this.canvas = null;
        this.debugMode = false;

        this.ncTokens = [
            Nc.on(Nc.ns.client.view.mesh.create, this.createMesh, this),
            Nc.on(Nc.ns.client.view.animatedMesh.create, this.createAnimatedMesh, this),
            Nc.on(Nc.ns.client.view.mesh.add, this.addMesh, this),
            Nc.on(Nc.ns.client.view.mesh.remove, this.removeMesh, this),
            Nc.on(Nc.ns.client.view.mesh.update, this.updateMesh, this),
            Nc.on(Nc.ns.client.view.mesh.addFilter, this.addFilter, this),
            Nc.on(Nc.ns.client.view.mesh.removeFilter, this.removeFilter, this),

            Nc.on(Nc.ns.client.view.fullscreen.change, this.onFullscreenChange, this),
            Nc.on(Nc.ns.client.view.debugMode.toggle, this.onToggleDebugMode, this),

            Nc.on(Nc.ns.client.view.playerInfo.createAndAdd, this.onCreateAndAddPlayerInfo, this),
            Nc.on(Nc.ns.client.view.playerInfo.update, this.onUpdatePlayerInfo, this),
            Nc.on(Nc.ns.client.view.playerInfo.remove, this.onRemovePlayerInfo, this),

            Nc.on(Nc.ns.client.game.zoomIn, this.onZoomIn, this),
            Nc.on(Nc.ns.client.game.zoomOut, this.onZoomOut, this),
            Nc.on(Nc.ns.client.game.zoomReset, this.onZoomReset, this),

            Nc.on(Nc.ns.client.view.preloadBar.update, this.onUpdateLoader, this),
        ];

        
    }

    AbstractView.prototype.isWebGlEnabled = function () { 
        try { 
            return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
        } catch(e) { 
            return false; 
        } 
    }

    AbstractView.prototype.initCanvas = function (canvas) {

    	this.canvas = canvas;
        DomController.initCanvas(canvas);
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

    AbstractView.prototype.addFilter = function(mesh, options) {
        throw new Exception('Abstract Function addFilter not overwritten');
    };

    AbstractView.prototype.removeFilter = function(mesh, options) {
        throw new Exception('Abstract Function removeFilter not overwritten');
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

    AbstractView.prototype.onZoomIn = function () {
        throw new Exception('Abstract Function onZoomIn not overwritten');
    };

    AbstractView.prototype.onZoomOut = function () {
        throw new Exception('Abstract Function onZoomOut not overwritten');
    };

    AbstractView.prototype.onZoomReset = function () {
        throw new Exception('Abstract Function onZoomReset not overwritten');
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

    AbstractView.prototype.onUpdateLoader = function(progress) {
        throw new Exception('Abstract Function onUpdateLoader not overwritten');
    };

    AbstractView.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };
    };

    return AbstractView;
});