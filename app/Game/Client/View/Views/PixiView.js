define([
    "Game/Client/View/Views/AbstractView",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi",
    "Game/Client/View/Views/Pixi/ColorRangeReplaceFilter",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/Client/View/Views/Pixi/GameStats",
    "Game/Client/View/Views/Pixi/Layer"
], 

function (Parent, DomController, PIXI, ColorRangeReplaceFilter, Settings, Nc, Exception, GameStats, Layer) {
    
    var AVAILABLE_MESH_FILTERS = {
        "blur": PIXI.BlurFilter,
        "desaturate": PIXI.GrayFilter,
        "pixelate": PIXI.PixelateFilter,
        "colorRangeReplace": ColorRangeReplaceFilter,
    };

    function PixiView () {

        Parent.call(this);

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
        this.layers = [];

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

    // Layers

    PixiView.prototype.createAndAddLayer = function(name) {
        
        var layer =  new Layer(name, 1);
        this.layers.push(layer);
        this.stage.addChild(layer.getContainer());
    };

    // Meshes

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
        if (options.alpha) mesh.alpha = options.alpha;
        if (options.width) mesh.width = options.width;
        if (options.height) mesh.height = options.height;
        if (options.xScale) mesh.width = Math.abs(mesh.width) * options.xScale;
        if (options.yScale) mesh.scale.y = options.yScale;
        if (options.visible === true || options.visible === false) mesh.visible = options.visible;
        if (options.pivot) mesh.pivot = new PIXI.Point(options.pivot.x, options.pivot.y);
    }

    PixiView.prototype.addFilter = function(mesh, filterName, options) {

        if (!AVAILABLE_MESH_FILTERS.hasOwnProperty(filterName)) {
            throw new Exception('Filter ' + filterName + ' is not available');
        }
        
        var MeshFilter = AVAILABLE_MESH_FILTERS[filterName];
        var filter = new MeshFilter();

        switch (filterName) {
            case 'desaturate':
                if (options.amount) filter.gray = options.amount;
                break;

            case 'blur':
                if (options.blurX) filter.blurX = options.blurX;
                if (options.blurY) filter.blurY = options.blurY;
                break;

            case 'colorRangeReplace':
                if (options.minColor) filter.minColor = options.minColor;
                if (options.maxColor) filter.maxColor = options.maxColor;
                if (options.newColor) filter.newColor = options.newColor;
                if (options.brightnessOffset) filter.brightnessOffset = options.brightnessOffset;
                break;

            case 'pixelate':
                if (options.sizeX) filter.size.x = options.sizeX;
                if (options.sizeY) filter.size.y = options.sizeY;
                break;

            default:
                break;
        }

        var filters = mesh.filters;

        if(!filters) {
            filters = [];
        } else {
            // ensure uniqueness of filter by name
            this.removeFilter(mesh, filterName);
        }

        filters.push(filter);
        mesh.filters = filters;
    };

    PixiView.prototype.removeFilter = function(mesh, filterName) {

        var filters = mesh.filters;

        if(!filters) {
            return;
        }

        var MeshFilter = AVAILABLE_MESH_FILTERS[options.filter];

        filters = filters.filter(function(filter){
            return !filter instanceof MeshFilter;
        });

        mesh.filters = filter;
    };

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
        
        for (var i = 0; i < this.stage.children.length; i++) {
            this.stage.removeChild(this.stage.children[i]);
        }

        this.renderer.render(this.stage);

        Parent.prototype.destroy.call(this);
    };

    return PixiView;
});
