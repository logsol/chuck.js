define([
    "Game/Client/View/Abstract/View",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/Client/View/Pixi/GameStats",
    "Game/Client/View/LayerManager",
    "Game/Client/View/Pixi/Layers/Ghost"
], 

function (Parent, DomController, PIXI, Settings, Nc, Exception, GameStats, LayerManager, Ghost) {

    function PixiView () {

        Parent.call(this);

        this.layerManager = null;
        this.stage = null;
        this.container = null;
        this.infoContainer = null;
        this.infoFilters = [];
        this.loader = null;
        this.currentZoom = Settings.ZOOM_DEFAULT;

        this.init();

        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    }

    PixiView.prototype = Object.create(Parent.prototype);

    PixiView.prototype.init = function () {

        var transparent = false;
        var antialias = true;
        var canvas = DomController.getCanvas();

        if(Settings.USE_WEBGL) {
            this.renderer = new PIXI.WebGLRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT, canvas, transparent, antialias);
            console.log('WebGLRenderer')
        } else {
            this.renderer = new PIXI.CanvasRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT, canvas, transparent, antialias);
            console.log('CanvasRenderer - not using WebGL!')
        }

        this.stage = new PIXI.Stage(0x333333);

        this.container = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.container);

        this.layerManager = new LayerManager(this.container, this.me);

        this.initLoader();

        this.initCanvas(this.renderer.view);

        this.gameStats = new GameStats(this.container);
        this.stage.addChild(this.gameStats.getInfoContainer());

        this.ghostLayer = new Ghost();
        this.layerManager.insert(this.ghostLayer, false);
    }

    PixiView.prototype.render = function () {
        if (this.me) {
            this.layerManager.render(this.calculateCenterPosition(), this.currentZoom);
        }

        this.renderer.render(this.stage);
    }

    PixiView.prototype.calculateCenterPosition = function() {
        var target = this.me.getHeadPosition();
        var centerPosition = {x: target.x, y: target.y};
        centerPosition.x *= -Settings.RATIO * this.currentZoom;
        centerPosition.y *= -Settings.RATIO * this.currentZoom;

        centerPosition.x += Settings.STAGE_WIDTH / 2;
        centerPosition.y += Settings.STAGE_HEIGHT / 2;

        centerPosition.x -= this.me.playerController.xyInput.x * Settings.STAGE_WIDTH / 4;
        centerPosition.y += this.me.playerController.xyInput.y * Settings.STAGE_HEIGHT / 4;

        return centerPosition;
    };

    PixiView.prototype.onFullscreenChange = function(isFullScreen) {
        Parent.prototype.onFullscreenChange.call(this, isFullScreen);

        if(isFullScreen) {
            this.renderer.resize(window.innerWidth, window.innerHeight);
            this.currentZoom = window.innerWidth / 600;
        } else {
            this.renderer.resize(600, 400);
            this.currentZoom = 1;
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
                var color = 0x00FF00;
                if(options.healthFactor < 0.30) color = 0xFF0000;
                playerInfo.beginFill(color);
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




    PixiView.prototype.initLoader = function() {
        this.loader = new PIXI.Graphics();
        this.stage.addChild(this.loader);
        this.onUpdateLoader(0);
    };

    PixiView.prototype.onUpdateLoader = function(progress) {
        var width = 200,
            height = 5,
            borderWidth = 1;

        if(progress < 100) {
            this.loader.clear();

            this.loader.beginFill(0x000000);
            this.loader.lineStyle(borderWidth, 0x000000);
            this.loader.drawRect(0, 0, width, height);
            this.loader.endFill();

            if(progress > 0) {
                var color = 0xFF0FA3;
                this.loader.beginFill(color);
                this.loader.lineStyle(0, 0x000000);
                this.loader.drawRect(borderWidth, borderWidth, width * progress / 100, height);
                this.loader.endFill();
            }

            this.loader.position = new PIXI.Point(
                Settings.STAGE_WIDTH / 2 - width / 2 - borderWidth,
                Settings.STAGE_HEIGHT / 2 - height / 2 - borderWidth
            );
        }

        this.loader.visible = progress < 100;
    };

    PixiView.prototype.onZoomIn = function() {
        console.log("onZoomIn")
        if(this.currentZoom + Settings.ZOOM_FACTOR <= Settings.ZOOM_MAX) {
            this.currentZoom += Settings.ZOOM_FACTOR;
        }
    };
    
    PixiView.prototype.onZoomOut = function() {
        if(this.currentZoom - Settings.ZOOM_FACTOR > 0) {
            this.currentZoom -= Settings.ZOOM_FACTOR;
        }
    };    

    PixiView.prototype.onZoomReset = function() {
        this.currentZoom = Settings.ZOOM_DEFAULT;
    };

    PixiView.prototype.destroy = function() {

        this.layerManager.destroy();

        this.ghostLayer.destroy();
        
        for (var i = 0; i < this.stage.children.length; i++) {
            this.stage.removeChild(this.stage.children[i]);
        }

        this.renderer.render(this.stage);

        Parent.prototype.destroy.call(this);
    };

    return PixiView;
});
