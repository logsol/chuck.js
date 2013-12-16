define([
    "Game/Client/View/DomController", 
    "Game/Config/Settings", 
    "Game/Client/View/CameraController"
],

function (DomController, Settings, CameraController) {
    
    function ViewController () {

        this.mesh = null;
        this.scene = null;
        this.renderer = null;
        this.cameraController = new CameraController();
        this.movableObjects = [];

        this.init();
    }

    ViewController.prototype.isWebGlEnabled = function () { 
        try { 
            return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
        } catch(e) { 
            return false; 
        } 
    }

    ViewController.prototype.init = function () {

        var self = this;

        DomController.setCanvas(this.renderer.domElement);

        if(Settings.DEBUG_MODE) {
            DomController.createDebugCanvas();
        }

    }

    ViewController.prototype.loadPlayerMesh = function(player) {
        
    };

    ViewController.prototype.loadMeshes = function(objects) {

    };

    ViewController.prototype.tileAtPositionExists = function(objects, x, y) {

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            if(o.x == x && o.y == y) return true;
        }
        return false;
    };

    ViewController.prototype.render = function () {

    }

    ViewController.prototype.createMesh = function (width, height, x, y, imgPath, callback) {

    }

    ViewController.prototype.setMe = function(player) {
        this.me = player;
    };

    ViewController.prototype.addPlayer = function(player) {
 
    };

    ViewController.prototype.removPlayer = function(player) {

    };

    return ViewController;
});