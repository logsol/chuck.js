define([
    "Game/Client/View/Abstract/Layer",
	"Lib/Vendor/Pixi",
    "Game/Client/View/Pixi/ColorRangeReplaceFilter",
    "Game/Config/Settings",
    "Lib/Utilities/ColorConverter",
    "Lib/Utilities/NotificationCenter"
],

function (Parent, PIXI, ColorRangeReplaceFilter, Settings, ColorConverter, nc) {

	"use strict";
    
    function Layer (name, options) {
        Parent.call(this, name, options);
        this.container = new PIXI.DisplayObjectContainer();
        this.container.x = 0;
        this.container.y = 0;
        this.static = false;
        this.levelSize = {
            width: 0,
            height: 0
        }

        this.ncTokens = this.ncTokens.concat([
            nc.on(nc.ns.client.view.layer.levelSizeUpdate, this.onLevelSizeUpdate, this)
        ]);

        if (Settings.SHOW_LAYER_INFO) {

            var self = this;
            var g = new PIXI.Graphics();
            var converter = new ColorConverter();
            var c = converter.getColorByName(name);
            var fontSize = 12;
            var textOptions = {
                font: "normal " + fontSize + "px 'Joystix'",
                fill: "#" + c.toString(16),
            };

            var t = new PIXI.Text(name, textOptions);

            var y = 0;
            switch (name) {
                case "ghost": y++;
                case "item": y++;
                case "tile": y++;
                case "spawn": y=y;
            }

            t.position = new PIXI.Point(0, fontSize * y);

            g.lineStyle (1, c, 1); 
            g.drawRect (0, 0, 100 + y, 100 + y);

            setTimeout(function(){
                self.container.addChild(t);
                self.container.addChild(g);
            }, 500);
        }
    }

    Layer.prototype = Object.create(Parent.prototype);

    Layer.prototype.onLevelSizeUpdate = function(levelSize) {
        this.levelSize = levelSize;
    };

    Layer.prototype.getAvailableMeshFilters = function() {
        return {
            "blur": PIXI.BlurFilter,
            "desaturate": PIXI.GrayFilter,
            "pixelate": PIXI.PixelateFilter,
            "colorRangeReplace": ColorRangeReplaceFilter,
        };
    };

    Layer.prototype.getContainer = function() {
        return this.container;
    };

    Layer.prototype.show = function() {
        this.container.visible = true;
    };

    Layer.prototype.hide = function() {
        this.container.visible = false;
    };

    Layer.prototype.addMesh = function(mesh) {
        this.container.addChild(mesh);
    };

    Layer.prototype.removeMesh = function(mesh) {
        this.container.removeChild(mesh);
    };

    Layer.prototype.swapMeshIndexes = function(meshA, meshB) {
        var indexA = this.container.getChildIndex(meshA);
        var indexB = this.container.getChildIndex(meshB);

        this.container.setChildIndex(meshA, indexB);
        this.container.setChildIndex(meshB, indexA);
    };

    Layer.prototype.swapMeshes = function(meshA, meshB) {
        var textureA = meshA.texture;
        var textureB = meshB.texture;

        meshA.setTexture(textureB);
        meshA.onTextureUpdate();
        meshA.scale.x = 1;
        meshA.scale.y = 1;

        meshB.setTexture(textureA);
        meshB.onTextureUpdate();
        meshB.scale.x = 1;
        meshB.scale.y = 1;

    };

    Layer.prototype.createMesh = function (texturePath, callback, options) {

        var texture = (options && options.fromFrame)
            ? PIXI.Texture.fromFrame(texturePath)
            : PIXI.Texture.fromImage(texturePath);
        

        var mesh = new PIXI.Sprite(texture);

        if(options) this.updateMesh(mesh, options);

        callback(mesh);
    };

    Layer.prototype.createAnimatedMesh = function (texturePaths, callback, options) {
        var textures = [];
        for (var i = 0; i < texturePaths.length; i++) {

            var texture = (options && options.fromFrame)
                ? PIXI.Texture.fromFrame(texturePaths[i])
                : PIXI.Texture.fromImage(texturePaths[i]);

            texture.width = options.width;
            texture.height = options.height;
            //PIXI.texturesToUpdate.push(texture);
            textures.push(texture);
        }

        var mesh = new PIXI.MovieClip(textures);
        if(options) this.updateMesh(mesh, options);

        mesh.animationSpeed = 0.5;

        mesh.play();

        callback(mesh);
    }

    Layer.prototype.updateMesh = function(mesh, options) {
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
        if (options.anchor) mesh.anchor = options.anchor;
        if (options.animationSpeed) mesh.animationSpeed = options.animationSpeed;
    };

    Layer.prototype.addFilter = function(mesh, filterName, options) {

        // use game container if mesh null
        if(mesh === null) {

        }

        if (!this.getAvailableMeshFilters().hasOwnProperty(filterName)) {
            throw new Exception('Filter ' + filterName + ' is not available');
        }
        
        var MeshFilter = this.getAvailableMeshFilters()[filterName];
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

    Layer.prototype.removeFilter = function(mesh, filterName) {

        var filters = mesh.filters;

        if(!filters) {
            return;
        }

        // FIXME this should throw an error i think since "options" is not defined here
        // maybe we never actually call this method?
        var MeshFilter = this.getAvailableMeshFilters()[options.filter];

        filters = filters.filter(function(filter){
            return !filter instanceof MeshFilter;
        });

        mesh.filters = filter;
    };

    Layer.prototype.render = function(centerPosition, zoom) {
        this.setPosition(centerPosition);
        
        this.setZoom(zoom);

        // Zoom
        var zoomStep = (this.zoom.target - this.zoom.current) * Settings.CAMERA_GLIDE / 100;
        this.zoom.current += zoomStep;
        this.container.scale.x = this.zoom.current;
        this.container.scale.y = this.container.scale.x;


        /*
        // we would need another zoom state, 
        // to separate fixed zooming (by window size)
        // and user zoom by +/-/0 keys

        // this snippet would zoom the layers by its parallax
        // so further away layers would not zoom as much.

        var zoomParallax = this.parallaxSpeed == 0 
            ? 1
            : this.parallaxSpeed < 0 
                ? (1 + this.parallaxSpeed)
                : this.parallaxSpeed + 1000;

        var newZoomTarget = 1 + Math.log(this.zoom.target+2) * (zoomParallax)
        console.log(newZoomTarget)

        this.container.scale.x = newZoomTarget;
        this.container.scale.y = newZoomTarget;

        // Later, this would need to be added as well:
        this.container.x *= newZoomTarget;
        this.container.y *= newZoomTarget;
        */


        // Position

        if (!this.static) {
            var posXStep = (this.position.target.x - this.position.current.x) * Settings.CAMERA_GLIDE / 100;
            this.position.current.x += posXStep;

            var posYStep = (this.position.target.y - this.position.current.y) * Settings.CAMERA_GLIDE / 100;
            this.position.current.y += posYStep;

            // Add here to set 0,0 not in the center of the map but the level origin in the top left
            // FIXME: use a different kind of flag than "name"
            if (this.name == "spawn" 
                || this.name == "tile" 
                || this.name == "item"
                || this.name == "ghost"
                || this.name == "swiper"
                || this.parallaxSpeed == 0) {

                this.container.x = this.position.current.x;
                this.container.y = this.position.current.y;

            } else {
                var x = this.position.current.x + this.levelSize.width / 2;
                this.container.x = x - x * -this.parallaxSpeed;
                var y = this.position.current.y + this.levelSize.height / 2;
                this.container.y = y - y * -this.parallaxSpeed;
            }

            this.container.x *= this.zoom.current;
            this.container.y *= this.zoom.current;

            this.container.x += Settings.STAGE_WIDTH / 2;
            this.container.y += Settings.STAGE_HEIGHT / 2;
        }    
    };

    return Layer;
});