define([
    "Lib/Utilities/Abstract",
    "Game/Client/View/DomController", 
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter"
],

function (Abstract, domController, Settings, Exception, nc) {

	"use strict";
    
    function AbstractView () {
    	this.me = null;
        this.canvas = null;
        this.debugMode = false;

        this.ncTokens = [
            nc.on(nc.ns.client.view.display.change, this.onDisplaySizeChange, this),
            nc.on(nc.ns.client.view.debugMode.toggle, this.onToggleDebugMode, this),

            nc.on(nc.ns.client.game.zoomIn, this.onZoomIn, this),
            nc.on(nc.ns.client.game.zoomOut, this.onZoomOut, this),
            nc.on(nc.ns.client.game.zoomReset, this.onZoomReset, this),

            nc.on(nc.ns.client.view.preloadBar.update, this.onUpdateLoader, this),
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
        domController.initCanvas(canvas);
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
    AbstractView.prototype.onDisplaySizeChange = function(isFullScreen) {

/*
        if (!isFullScreen) {
            Settings.STAGE_WIDTH = 600;
            Settings.STAGE_HEIGHT = 400;
        } else {
            // FIXME: Create FIXME meme (dumb and dumber)
            // FIXME: don't overwrite Settings
            Settings.STAGE_WIDTH = window.innerWidth;
            Settings.STAGE_HEIGHT = window.innerHeight;
        }
        */
        
        Settings.STAGE_WIDTH = window.innerWidth;
        Settings.STAGE_HEIGHT = window.innerHeight;
    };

    AbstractView.prototype.onToggleDebugMode = function(debugMode) {
        if(debugMode) {
            //this.setCameraPosition(-Settings.STAGE_WIDTH / 2, -Settings.STAGE_HEIGHT / 2);
        }

        this.debugMode = debugMode;
    };

    AbstractView.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            nc.off(this.ncTokens[i]);
        };
    };

    return AbstractView;
});