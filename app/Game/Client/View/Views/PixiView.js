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
        this.infoContainer = null;
        this.infoFilters = [];
        this.infoBox = null;
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
        this.initInfo();

        this.setCanvas(this.renderer.view);
    }


    PixiView.prototype.initCamera = function () {
        this.container = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.container);
    }

    PixiView.prototype.initInfo = function() {
        this.infoContainer = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.infoContainer);

        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blurX = 12;
        blurFilter.blurY = 12;
        var grayFilter = new PIXI.GrayFilter();
        grayFilter.gray = 0.85;
        this.infoFilters = [blurFilter, grayFilter];

        this.infoText = new PIXI.Text("", {font: "normal 20px monospace", fill: "red", align: "center"});
        this.infoBox = new PIXI.Graphics();
        this.infoBox.alpha = 0.7;

        this.infoContainer.addChild(this.infoBox);
        this.infoContainer.addChild(this.infoText);

        this.infoContainer.visible = false;
    };

    PixiView.prototype.render = function () {
        if(this.me && this.me.isSpawned) {
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
            texture.width = options.width;
            texture.height = options.height;
            PIXI.texturesToUpdate.push(texture);
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

    PixiView.prototype.toggleInfo = function(show, string) {
        if(show) {
            this.infoText.setText(string);
            this.infoText.updateText();
            this.infoText.dirty = false;

            var x = Settings.STAGE_WIDTH / 2 - this.infoText.width / 2,
                y = Settings.STAGE_HEIGHT / 2 - this.infoText.height / 2;
            this.infoText.position = new PIXI.Point(x, y);

            var borderWidth = 3;
            var padding = 20;
            this.infoBox.clear();
            this.infoBox.beginFill(0x000000);
            this.infoBox.lineStyle(borderWidth, 0xAA0000);
            this.infoBox.drawRect(0, 0, this.infoText.width - borderWidth + 2 * padding * 2, this.infoText.height - borderWidth + 2 * padding);
            this.infoBox.endFill();
            this.infoBox.position.x = this.infoText.position.x + borderWidth/2 - padding * 2;
            this.infoBox.position.y = this.infoText.position.y + borderWidth/2 - padding;

            this.infoContainer.visible = true;
            this.container.filters = this.infoFilters;
            this.infoFilters.forEach(function(filter) { filter.dirty = true; });
        } else {
            this.infoText.setText("...");
            this.infoContainer.visible = false;
            this.container.filters = null;
        }
    };

    return PixiView;
});
