define([
    "Game/" + GLOBALS.context + "/Loader/Level",
    "Game/Config/Settings", 
    "Game/Config/ItemSettings",
    "Lib/Vendor/Box2D", 
    "Lib/Utilities/OptionsHelper",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert",
    "Game/Client/View/Abstract/Layer", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",

], function (Parent, Settings, ItemSettings, Box2D, OptionsHelper, Exception, nc, Assert, AbstractLayer, CollisionDetector, Tile, Item, Skateboard) {
    
    "use strict";

    function TiledLevel (path, engine) {

        this.layerMapping = {
            tiles: this.createTiles.bind(this),
            items: this.createItems.bind(this),
            spawnpoints: this.createSpawnPoints.bind(this)
            //collision: this.createTiles.bind(this), collision renamed to tiles
        };

        this.levelData = null;
        Parent.call(this, path, engine);
    }

    TiledLevel.prototype = Object.create(Parent.prototype);


    TiledLevel.prototype.setup = function(levelData) {
        this.levelData = levelData;

        var spawnpointsExists = levelData.layers.some(function(o) {
            return o.name == AbstractLayer.ID.SPAWN;
        });

        if (!spawnpointsExists) {
            console.warn("No layerMapping for level file layer: " + layerOptions.name);
            return;
        }

        function getLayerId(name, i) {
            var mapping = {
                tiles: AbstractLayer.ID.TILE,
                items: AbstractLayer.ID.ITEM,
                spawnpoints: AbstractLayer.ID.SPAWN
            };
            if(mapping[name]) {
                return mapping[name];
            }

            return "layer-" + i + "-" + name;
        }

        var spawnpointsFound = false,
            lastLayerId = null;

        // from spawnpoints to background
        for (var i = levelData.layers.length - 1; i >= 0; i--) {
            var layerOptions = levelData.layers[i];
            layerOptions.z = i;
            layerOptions.layerId = getLayerId(layerOptions.name, i);

            if (layerOptions.name == AbstractLayer.ID.SPAWN) {
                spawnpointsFound = true;
            }

            if (!spawnpointsFound) {
                continue;
            }

            // Setting up spawnpoints and then all layers behind it
            this.setupLayer(layerOptions, true, lastLayerId);

            if(this.layerMapping[layerOptions.name]) {
                this.layerMapping[layerOptions.name](layerOptions);
            }

            lastLayerId = layerOptions.layerId;
        }

        spawnpointsFound = false; // reset (used in mkLayer)
        lastLayerId = AbstractLayer.ID.SPAWN;


        // from spawnpoints to foreground
        for (var i = 0; i < levelData.layers.length; i++) {
            var layerOptions = levelData.layers[i];
            layerOptions.z = i;
            layerOptions.layerId = getLayerId(layerOptions.name, i);

            if (layerOptions.name == AbstractLayer.ID.SPAWN) {
                spawnpointsFound = true;
                continue;
            }

            if (!spawnpointsFound) {
                continue;
            }

            // Setting up all layers before
            this.setupLayer(layerOptions, false, lastLayerId);

            if(this.layerMapping[layerOptions.name]) {
                this.layerMapping[layerOptions.name](layerOptions);
            }

            lastLayerId = layerOptions.layerId;
        }


        Parent.prototype.setup.call(this, levelData);
    };

    TiledLevel.prototype.createTiles = function(options) {

        var data = options.data;
        var tilesOptions = [];
        for (var i = 0; i < data.length; i++) {

            var gid = data[i];
            if(gid === 0) continue;

            var imagePath = this.getTileImagePath(gid);

            var parts = imagePath.split("/");
            var tileType = parts[parts.length - 1].split(".")[0].split("");

            // FIXME rename s to shape, r to rotation etc.

            var tileOptions = {
                s: parseInt(tileType[0], 10),
                r: parseInt(tileType[1], 10),
                t: imagePath,
                x: i % options.width,
                y: parseInt(i / options.width , 10)
            };

            tilesOptions.push(tileOptions);
        }

        Parent.prototype.createTiles.call(this, tilesOptions);
    };

    TiledLevel.prototype.createItems = function(options) {
        var objects = options.objects;
        var itemsOptions = [];
        for (var i = 0; i < objects.length; i++) {
            options = this.gatherOptions(objects[i]);
            itemsOptions.push(options);
        }

        Parent.prototype.createItems.call(this, itemsOptions);
    };

    TiledLevel.prototype.createSpawnPoints = function(options) {
        var points = options.objects.map(function(o) {
            return { x: o.x, y: o.y };
        });

        Parent.prototype.createSpawnPoints.call(this, points);
    };

    TiledLevel.prototype.gatherOptions = function(tiledObject) {
        var options = this.getDefaultItemSettingsByName(tiledObject.name);
        options.name = tiledObject.name;
        options.x = (tiledObject.x + options.width / 2) / Settings.TILE_RATIO;
        options.y = (tiledObject.y + options.height / 2) / Settings.TILE_RATIO;
        // FIXME: check RAD vs. DEG for options.rotation = tiledObject.rotation;

        return options;
    };

    TiledLevel.prototype.getDefaultItemSettingsByName = function(name) {

        if(!name) {
            throw new Exception("Item name cannot be be empty");
        }

        if(ItemSettings[name] === undefined) {
            throw new Exception("Item name (" + name + ") cannot be found in item list");
        }

        return OptionsHelper.merge(ItemSettings[name], ItemSettings.Default);
    };

    TiledLevel.prototype.getTileImagePath = function(gid) {
        for (var i = 0; i < this.levelData.tilesets.length; i++) {
            var tileset = this.levelData.tilesets[i];
            var offset = tileset.firstgid;
            if(gid >= offset && gid < offset + Object.keys(tileset.tiles).length) {
                return tileset.tiles["" + (gid - offset)].image;
            }
        }
    };

    return TiledLevel;
});