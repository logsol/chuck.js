define([
    "Game/Client/View/Abstract/View",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/Client/View/Pixi/GameStats",
    "Game/Client/View/LayerManager",
    "Game/Client/View/Pixi/Layers/Ghost",
    "Game/Client/View/Pixi/Layers/Swiper",
    "Game/Client/PointerLockManager",
    "Game/Client/View/Pixi/Layers/Debug",
    "Game/Client/View/Pixi/Layers/Messages"
], 

function (Parent, domController, PIXI, Settings, nc, Exception, GameStats, LayerManager, Ghost, Swiper, PointerLockManager, Debug, Messages) {

	"use strict";

    function PixiView () {

        Parent.call(this);

        this.xyz = Math.random()

        this.layerManager = null;
        this.stage = null;
        this.container = null;
        this.infoContainer = null;
        this.loader = null;
        this.currentZoom = Settings.ZOOM_DEFAULT;
        this.clickToEnable = null;

        this.init();

        this.ncTokens = this.ncTokens.concat([
            nc.on(nc.ns.client.pointerLock.change, this.onPointerLockChange, this),
            nc.on(nc.ns.core.game.events.level.loaded, this.showDefaultLayers, this)
        ]);

        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    }

    PixiView.prototype = Object.create(Parent.prototype);

    PixiView.prototype.init = function () {

        var rendererOptions = {
            view: domController.getCanvas(),
            antialiasing: false,
            transparent: false,
            resolution: 1
        }

        if(Settings.USE_WEBGL) {

            PIXI.WebGLRenderer.glContextId = 0;
            this.renderer = new PIXI.WebGLRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT, rendererOptions);
            console.log('WebGLRenderer');

        } else {

            this.renderer = new PIXI.CanvasRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT, rendererOptions);
            console.warn('CanvasRenderer - not using WebGL!');

        }

        this.onDisplaySizeChange(false);

        this.stage = new PIXI.Stage(0x333333);

        this.container = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.container);

        this.layerManager = new LayerManager(this.container, this.me);

        this.initLoader();

        this.initCanvas(this.renderer.view);

        this.initPointerLockView();

        // Tab Overlay (not using layer manager, cause of filters)
        this.gameStats = new GameStats(this);
        this.stage.addChild(this.gameStats.getInfoContainer());

        this.ghostLayer = new Ghost();
        this.ghostLayer.hide();
        this.layerManager.insert(this.ghostLayer, false);

        this.swiperLayer = new Swiper();
        this.swiperLayer.hide()
        this.layerManager.insert(this.swiperLayer, false);

        this.debugLayer = Debug;
        this.debugLayer.hide();
        this.layerManager.insert(this.debugLayer, false);

        this.messagesLayer = new Messages();
        this.messagesLayer.hide();
        this.layerManager.insert(this.messagesLayer, false);

        this.render();
    }

    PixiView.prototype.showDefaultLayers = function() {
        this.ghostLayer.show();
        this.swiperLayer.show()
        this.debugLayer.show();
        this.messagesLayer.show();
    };

    PixiView.prototype.render = function () {

        if (this.me) {
            this.layerManager.render(this.calculateCenterPosition(), this.currentZoom);
        }

        this.renderer.render(this.stage);
    }

    PixiView.prototype.initPointerLockView = function() {
        if (!Settings.ENABLE_POINTER_LOCK_FILTER) return;
        
        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blurX = 42 * this.currentZoom;
        blurFilter.blurY = 42 * this.currentZoom;

        var pixelFilter = new PIXI.PixelateFilter();
        pixelFilter.pixelSize = 10 * this.currentZoom   ;

        var grayFilter = new PIXI.GrayFilter();
        grayFilter.gray = 0.99;
        this.pointerLockFilters = [pixelFilter, grayFilter];

        this.clickToEnable = new PIXI.Text("Click to start playing.");
        this.clickToEnable.visible = false;
        this.stage.addChild(this.clickToEnable)
    };

    PixiView.prototype.onPointerLockChange = function(isLocked, options) {
        if (!Settings.ENABLE_POINTER_LOCK_FILTER) return;

        if(isLocked) {
            this.removeFilters(this.pointerLockFilters);
            
            this.clickToEnable.visible = false;
            this.onZoomReset();
        } else {

            if(!options || options.start !== true) {
                this.clickToEnable.setText("Click to continue playing.");
            }

            this.clickToEnable.setStyle({
                font: "normal " + (14 * this.currentZoom) + "px 'Joystix'",
                fill: "#ffffff",
                stroke: "rgba(0,0,0,0.8)",
                strokeThickness: 6 * this.currentZoom
            });

            this.addFilters(this.pointerLockFilters);
            this.pointerLockFilters.forEach(function(filter) { filter.dirty = true; });

            this.clickToEnable.position = new PIXI.Point(Settings.STAGE_WIDTH / 2 - this.clickToEnable.width / 2, Settings.STAGE_HEIGHT / 2 - this.clickToEnable.height / 2)
            this.clickToEnable.visible = true;

            this.onZoomReset();
            this.currentZoom *= 0.9;
        }
    };

    PixiView.prototype.removeFilters = function(filters) {

        if(this.container && this.container.filters && this.container.filters.length) {
            for (var i = this.container.filters.length - 1; i >= 0; i--) {

                for (var j = filters.length - 1; j >= 0; j--) {
                    if (filters[j] === this.container.filters[i]) {
                        this.container.filters.splice(i, 1);
                    }
                }
            }

            // weird bug, filters.length cant be 0, must be set to null
            if(this.container.filters.length < 1) {
                this.container.filters = null;
            }
        }

    };

    PixiView.prototype.addFilters = function(filters) {
        if (filters.length < 1) return;
        if (!this.container) {
            return;
        }

        if (!this.container.filters) {
            /*
             * slice does a copy, which is important here - 
             * otherwise this.pointerLockFilters will be manipulated too on remove.
             */ 
            this.container.filters = filters.slice(); 
            return;
        }

        for (var i = 0; i < filters.length; i++) {
            this.container.filters.push(filters[i]);
        }
    };

    PixiView.prototype.calculateCenterPosition = function() {
        var target = this.me.getHeadPosition();
        
        var centerPosition = {x: target.x, y: target.y};
        centerPosition.x *= Settings.RATIO * -1;
        centerPosition.y *= Settings.RATIO * -1;

        var lookAt = this.me.getLookAt();
        centerPosition.x -= lookAt.x * 600 / 4;
        centerPosition.y += lookAt.y * 400 / 4;

        return centerPosition;
    };

    PixiView.prototype.onDisplaySizeChange = function(isFullScreen) {
        Parent.prototype.onDisplaySizeChange.call(this, isFullScreen);

        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.currentZoom = window.innerWidth / 600;

        PointerLockManager.update(null, {}); // only to reposition clickToEnable text
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
        if(this.currentZoom + Settings.ZOOM_FACTOR <= Settings.ZOOM_MAX) {
            this.currentZoom += Settings.ZOOM_FACTOR;
        }
    };
    
    PixiView.prototype.onZoomOut = function() {
        //if(this.currentZoom - Settings.ZOOM_FACTOR > window.innerWidth / 600) {
            this.currentZoom -= Settings.ZOOM_FACTOR;
        //}
    };

    PixiView.prototype.onZoomReset = function() {
        this.currentZoom = window.innerWidth / 600;
    };

    PixiView.prototype.getTexturesFromFrame = function(textureNames) {

        var textures = [];

        for (var i = 0; i < textureNames.length; i++) {
            textures.push(PIXI.Texture.fromFrame(textureNames[i]));
        };

        return textures;
    };

    PixiView.prototype.destroy = function() {

        this.layerManager.destroy(); // also calls all layers destroy

        for (var i = 0; i < this.stage.children.length; i++) {
            this.stage.removeChild(this.stage.children[i]);
        }

        this.renderer.render(this.stage);

        this.renderer.destroy();
        delete this.renderer;

        Parent.prototype.destroy.call(this);
    };

    return PixiView;
});
