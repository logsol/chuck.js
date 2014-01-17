define([
    "Game/Client/View/Views/AbstractView",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi", 
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter"
], 

function (Parent, DomController, PIXI, Settings, NotificationCenter) {
    
    function PixiView () {

        Parent.call(this);

        this.movableObjects = [];
        this.camera = null;
        this.stage = null;
        this.container = null;
        this.init();
        this.pixi = PIXI;
    }

    PixiView.prototype = Object.create(Parent.prototype);

    PixiView.prototype.init = function () {

        if(Settings.USE_WEBGL) {
            this.renderer = new PIXI.WebGLRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);
            console.log('WebGLRenderer')
        } else {
            this.renderer = new PIXI.CanvasRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);
            console.log('CanvasRenderer')
        }

        this.stage = new PIXI.Stage(0x333333);

        this.initCamera();

        /*
        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blurX = 12;
        blurFilter.blurY = 0;
        var grayFilter = new PIXI.GrayFilter();
        grayFilter.gray = .6;
        this.stage.filters = [grayFilter];
        */

        this.setCanvas(this.renderer.view);
    }

    PixiView.prototype.render = function () {
        if(this.me) {
            var pos = this.calculateCameraPosition();
            this.setCameraPosition(pos.x, pos.y);
        }

        this.renderer.render(this.stage);
    }

    PixiView.prototype.addMesh = function(mesh) {
        this.container.addChild(mesh);
    };

    PixiView.prototype.removeMesh = function(mesh) {
        this.container.removeChild(mesh);
    };

    PixiView.prototype.createMesh = function (texturePath, callback, options) {

        var texture = PIXI.Texture.fromImage(texturePath);

        var mesh = new PIXI.Sprite(texture);
        if(options) this.updateMesh(mesh, options);

        callback(mesh);
    }

    PixiView.prototype.createAnimatedMesh = function (texturePaths, callback, options) {
        var textures = [];
        for (var i = 0; i < texturePaths.length; i++) {
            var texture = PIXI.Texture.fromImage(texturePaths[i]);
            textures.push(texture);
        }

        var mesh = new PIXI.MovieClip(textures);
        if(options) this.updateMesh(mesh, options);
        mesh.animationSpeed = 0.5;

        mesh.play();

        callback(mesh);
    }

    PixiView.prototype.updateMesh = function(mesh, options) {
        if (options.x) mesh.position.x = options.x;
        if (options.y) mesh.position.y = options.y;
        if (options.rotation) mesh.rotation = options.rotation;
        if (options.xScale) mesh.scale.x = options.xScale;
        if (options.yScale) mesh.scale.y = options.yScale;
        if (options.width) mesh.width = options.width;
        if (options.height) mesh.height = options.height;
        if (options.visible === true || options.visible === false) mesh.visible = options.visible;
        if (options.pivot) {
            if(options.pivot.length) {
                switch(options.pivot) {
                    case "lb":
                        mesh.pivot.x = mesh.width / 2;
                        mesh.pivot.y = mesh.height / 2;
                        break;
                    default:
                        mesh.pivot.x = mesh.width / 2;
                        mesh.pivot.y = mesh.height;
                        break;

                }                
            }
        };
    }

    PixiView.prototype.initCamera = function () {

        this.container = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.container);
    }

    PixiView.prototype.calculateCameraPosition = function() {
        var zoom = this.container.scale.x;

        var pos = this.me.getHeadPosition();
        pos.x *= -Settings.RATIO * zoom;
        pos.y *= -Settings.RATIO * zoom;

        pos.x -= this.me.playerController.xyInput.x * Settings.STAGE_WIDTH / 4;
        pos.y += this.me.playerController.xyInput.y * Settings.STAGE_HEIGHT / 4;

        return pos;
    };

    PixiView.prototype.setCameraPosition = function (x, y) {
        if(!this.debugMode) {
            this.container.position.x = x + Settings.STAGE_WIDTH / 2;
            this.container.position.y = y + Settings.STAGE_HEIGHT / 2;
        }
    };

    PixiView.prototype.setCameraZoom = function (z) {
        this.container.scale.x = z;
        this.container.scale.y = z;

    };

    PixiView.prototype.onFullscreenChange = function(isFullScreen) {
        Parent.prototype.onFullscreenChange.call(this, isFullScreen);

        if(isFullScreen) {
            this.renderer.resize(window.innerWidth, window.innerHeight);
            this.setCameraZoom(window.innerWidth / 600);
        } else {
            this.renderer.resize(600, 400);
            this.setCameraZoom(1);
        }
    };

    return PixiView;
});
