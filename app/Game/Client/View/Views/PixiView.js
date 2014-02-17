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
            console.log('CanvasRenderer - not using WebGL!')
        }

        this.stage = new PIXI.Stage(0x333333);

        this.initCamera();
        this.initInfo();

        this.setCanvas(this.renderer.view);
    }

    PixiView.prototype.render = function () {
        if(this.me && this.me.isSpawned) {
            var pos = this.calculateCameraPosition();
            this.setCameraPosition(pos.x, pos.y);
        }

        this.renderer.render(this.stage);
    }

    // Meshes

    PixiView.prototype.addMesh = function(mesh) {
        this.container.addChild(mesh);
    };

    PixiView.prototype.removeMesh = function(mesh) {
        this.container.removeChild(mesh);
    };

    PixiView.prototype.createMesh = function (texturePath, callback, options) {

        var texture = PIXI.Texture.fromImage(texturePath, false, PIXI.BaseTexture.SCALE_MODE.NEAREST);

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
        if (options.width) mesh.width = options.width;
        if (options.height) mesh.height = options.height;
        if (options.xScale) mesh.width = Math.abs(mesh.width) * options.xScale;
        if (options.yScale) mesh.scale.y = options.yScale;
        if (options.visible === true || options.visible === false) mesh.visible = options.visible;
        if (options.pivot) mesh.pivot = new PIXI.Point(options.pivot.x, options.pivot.y);
    }

    // Camera

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

    // Info Overlay

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

    // Player Info

    PixiView.prototype.onCreateAndAddPlayerInfo = function(callback, options) {
        var playerInfo = new PIXI.Graphics();
        this.container.addChild(playerInfo);

        this.onUpdatePlayerInfo(playerInfo, options);

        callback(playerInfo);
    };

    PixiView.prototype.onUpdatePlayerInfo = function(playerInfo, options) {
        var width = 14,
            height = 2,
            borderWidth = 1,
            offsetX = -8,
            offsetY = -52;

        if(typeof options.healthFactor != 'undefined') {
            playerInfo.clear();

            playerInfo.beginFill(0x000000);
            playerInfo.lineStyle(borderWidth, 0x000000);
            playerInfo.drawRect(0, 0, width, height);
            playerInfo.endFill();

            if(options.healthFactor > 0) {
                playerInfo.beginFill(0x00FF00);
                playerInfo.lineStyle(0, 0x000000);
                playerInfo.drawRect(borderWidth, borderWidth, width * options.healthFactor, height);
                playerInfo.endFill();
            }
        }

        if (options.x && options.y) playerInfo.position = new PIXI.Point(offsetX + options.x, offsetY + options.y);
        if (options.visible === true || options.visible === false) playerInfo.visible = options.visible;
    };

    PixiView.prototype.onRemovePlayerInfo = function(playerInfo) {
        this.container.removeChild(playerInfo);
    };

    return PixiView;
});
