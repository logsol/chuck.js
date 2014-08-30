define([
    "Game/Client/View/Abstract/View",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi",
    "Game/Client/View/Pixi/ColorRangeReplaceFilter",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/Client/View/Pixi/GameStats",
    "Game/Client/View/LayerManager",
], 

function (Parent, DomController, PIXI, ColorRangeReplaceFilter, Settings, Nc, Exception, GameStats, LayerManager) {
    
    var AVAILABLE_MESH_FILTERS = {
        "blur": PIXI.BlurFilter,
        "desaturate": PIXI.GrayFilter,
        "pixelate": PIXI.PixelateFilter,
        "colorRangeReplace": ColorRangeReplaceFilter,
    };

    function PixiView () {

        Parent.call(this);

        this.layerManager = null;
        this.movableObjects = [];
        this.stage = null;
        this.container = null;
        this.infoContainer = null;
        this.infoFilters = [];
        this.infoBox = null;
        this.loader = null;
        this.init();
        this.pixi = PIXI;
        this.currentZoom = Settings.ZOOM_DEFAULT;

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

        this.layerManager = new LayerManager(this.stage);

        this.initCamera();
        this.initLoader();

        this.initCanvas(this.renderer.view);

        this.gameStats = new GameStats(this.container);
        this.stage.addChild(this.gameStats.getInfoContainer());
    }

    PixiView.prototype.render = function () {
        if(this.me) {
            var pos = this.calculateCameraPosition();
            this.setCameraPosition(pos.x, pos.y);
        }

        this.renderer.render(this.stage);
    }

    // Camera

    PixiView.prototype.initCamera = function () {
        this.container = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.container);
    }

    PixiView.prototype.calculateCameraPosition = function() {
        var targetZoom = this.currentZoom;

        var oldZoom = (this.container.scale.x + this.container.scale.y) / 2;
        var newZoom = (targetZoom -oldZoom) * Settings.CAMERA_GLIDE / 100;

        this.container.scale.x += newZoom;
        this.container.scale.y += newZoom;

        var target = this.me.getHeadPosition();
        target.x *= -Settings.RATIO * targetZoom;
        target.y *= -Settings.RATIO * targetZoom;

        target.x -= this.me.playerController.xyInput.x * Settings.STAGE_WIDTH / 4;
        target.y += this.me.playerController.xyInput.y * Settings.STAGE_HEIGHT / 4;

        var pos = this.getCameraPosition();

        pos.x += (target.x -pos.x) * Settings.CAMERA_GLIDE / 100;
        pos.y += (target.y -pos.y) * Settings.CAMERA_GLIDE / 100;

        return pos;
    };

    PixiView.prototype.setCameraPosition = function (x, y) {
        if(!this.debugMode) {
            this.container.position.x = x + Settings.STAGE_WIDTH / 2;
            this.container.position.y = y + Settings.STAGE_HEIGHT / 2;
        }
    };

    PixiView.prototype.getCameraPosition = function () { 
        var pos = this.container.position;

        pos.x = pos.x - Settings.STAGE_WIDTH / 2;
        pos.y = pos.y - Settings.STAGE_HEIGHT / 2;

        return pos;
    };

    PixiView.prototype.setCameraZoom = function (zoom) {
/*
        var oldZoom = this.container.scale.x;

        this.container.scale.x += (zoom -oldZoom) * Settings.CAMERA_GLIDE / 100;
        this.container.scale.y += (zoom -oldZoom) * Settings.CAMERA_GLIDE / 100;
*/
    };

    PixiView.prototype.onFullscreenChange = function(isFullScreen) {
        Parent.prototype.onFullscreenChange.call(this, isFullScreen);

        if(isFullScreen) {
            this.renderer.resize(window.innerWidth, window.innerHeight);
            this.currentZoom = window.innerWidth / 600;
            console.log(this.currentZoom);
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


    PixiView.prototype.onCreateAndAddPlayerArrow = function(callback, options) {
        var arrow = new PIXI.Graphics();
        arrow.visible = false;
        this.container.addChild(arrow);

        var width = 12,
            height = 12;

        arrow.beginFill(0xffffff, 0.1);
        arrow.lineStyle(0, 0x000000);
        arrow.moveTo(0, 0);
        arrow.lineTo(width, 0);
        arrow.lineTo(width / 2, height);
        arrow.endFill();
        arrow.pivot = new PIXI.Point(width/2, height/2);
        arrow.visible = true;

        this.onUpdatePlayerArrow(arrow, options);

        callback(arrow);
    };

    PixiView.prototype.onUpdatePlayerArrow = function(arrow, options) {

        var offsetX = 0,
            offsetY = -60,
            x = offsetX + options.x,
            y = offsetY + options.y;

        var target = new PIXI.Point(x, y);

        arrow.position.x += (target.x -arrow.position.x) * Settings.ARROW_GLIDE / 1.5 / 100;
        arrow.position.y += (target.y -arrow.position.y) * Settings.ARROW_GLIDE / 100;

        var angle = -Math.atan2(arrow.position.x - x, arrow.position.y - options.y);
        angle += 0.785398163 * 4;

        arrow.rotation = angle;
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
        
        for (var i = 0; i < this.stage.children.length; i++) {
            this.stage.removeChild(this.stage.children[i]);
        }

        this.renderer.render(this.stage);

        Parent.prototype.destroy.call(this);
    };

    return PixiView;
});
