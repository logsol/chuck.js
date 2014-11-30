define([
    "Lib/Utilities/Abstract",
    "Game/Client/View/DomController", 
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter"
],

function (Abstract, DomController, Settings, Exception, Nc) {
    
    function AbstractView () {
    	this.me = null;
        this.canvas = null;
        this.debugMode = false;

        this.ncTokens = [
            Nc.on(Nc.ns.client.view.fullscreen.change, this.onFullscreenChange, this),
            Nc.on(Nc.ns.client.view.debugMode.toggle, this.onToggleDebugMode, this),

            Nc.on(Nc.ns.client.view.playerInfo.createAndAdd, this.onCreateAndAddPlayerInfo, this),
            Nc.on(Nc.ns.client.view.playerInfo.update, this.onUpdatePlayerInfo, this),
            Nc.on(Nc.ns.client.view.playerInfo.remove, this.onRemovePlayerInfo, this),

            Nc.on(Nc.ns.client.view.playerArrow.createAndAdd, this.onCreateAndAddPlayerArrow, this),
            Nc.on(Nc.ns.client.view.playerArrow.update, this.onUpdatePlayerArrow, this),

            Nc.on(Nc.ns.client.game.zoomIn, this.onZoomIn, this),
            Nc.on(Nc.ns.client.game.zoomOut, this.onZoomOut, this),
            Nc.on(Nc.ns.client.game.zoomReset, this.onZoomReset, this),

            Nc.on(Nc.ns.client.view.preloadBar.update, this.onUpdateLoader, this),
        ];
    }

    Abstract.prototype.addMethod.call(AbstractView, 'render');
    Abstract.prototype.addMethod.call(AbstractView, 'addFilter', ['mesh', 'options']);
    Abstract.prototype.addMethod.call(AbstractView, 'removeFilter', ['mesh', 'options']);
    Abstract.prototype.addMethod.call(AbstractView, 'setCameraPosition', ['x', 'y']);
    Abstract.prototype.addMethod.call(AbstractView, 'onZoomIn');
    Abstract.prototype.addMethod.call(AbstractView, 'onZoomOut');
    Abstract.prototype.addMethod.call(AbstractView, 'onZoomReset');
    Abstract.prototype.addMethod.call(AbstractView, 'toggleInfo', ['show', 'string']);
    Abstract.prototype.addMethod.call(AbstractView, 'onCreateAndAddPlayerInfo', ['options']);
    Abstract.prototype.addMethod.call(AbstractView, 'onCreateAndAddPlayerArrow', ['options']);
    Abstract.prototype.addMethod.call(AbstractView, 'onUpdatePlayerArrow', ['options']);
    Abstract.prototype.addMethod.call(AbstractView, 'onUpdatePlayerInfo', ['mesh', 'options']);
    Abstract.prototype.addMethod.call(AbstractView, 'onRemovePlayerInfo', ['mesh']);
    Abstract.prototype.addMethod.call(AbstractView, 'onUpdateLoader', ['progress']);

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

    AbstractView.prototype.setMe = function(player) {
        this.me = player;
    };
/*
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
*/
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

    AbstractView.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };
    };

    return AbstractView;
});