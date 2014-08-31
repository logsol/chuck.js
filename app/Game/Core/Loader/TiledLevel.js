define([
    "Game/" + GLOBALS.context + "/Loader/Level",
    "Game/Config/Settings", 
    "Game/Config/ItemSettings",
    "Lib/Vendor/Box2D", 
    "Lib/Utilities/Options",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",

], function (Parent, Settings, ItemSettings, Box2D, Options, Exception, Nc, CollisionDetector, Tile, Item, Skateboard) {
    
    function TiledLevel (path, engine) {

        this.layerMapping = {
            tiles: this.createTiles.bind(this),
            collision: this.createTiles.bind(this),
            items: this.createItems.bind(this),
            spawnpoints: this.createSpawnPoints.bind(this)
        };

        this.levelData = null;
        Parent.call(this, path, engine);
    }

    TiledLevel.prototype = Object.create(Parent.prototype);


    TiledLevel.prototype.setup = function(levelData) {
        this.levelData = levelData;

        // Make sure spawnpoints layer is created first
        var layers = levelData.layers.sort(function(a, b) {
            return a.name == "spawnpoints" ? -1 : b.name == "spawnpoints" ? 1 : 0;
        });

        for (var i = 0; i < layers.length; i++) {
            var layerOptions = layers[i];
            layerOptions.z = i;
            if(this.layerMapping[layerOptions.name]) {

                this.layerMapping[layerOptions.name](layerOptions);
            } else {
                console.warn('No layerMapping for level file layer: ' + layerOptions.name);
            }
        };

        Parent.prototype.setup.call(this, levelData);
    };

    TiledLevel.prototype.createTiles = function(options) {
        console.log('core tiledlevel createTiles');

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
                y: parseInt(i / options.height , 10)
            }

            tilesOptions.push(tileOptions);
        }

        Parent.prototype.createTiles.call(this, tilesOptions);
    }

    TiledLevel.prototype.createItems = function(options) {
        var objects = options.objects;
        var itemsOptions = []
        for (var i = 0; i < objects.length; i++) {
            var options = this.gatherOptions(objects[i]);
            itemsOptions.push(options);
        };

        Parent.prototype.createItems.call(this, itemsOptions);
    };

    TiledLevel.prototype.createSpawnPoints = function(options) {
        var points = options.objects.map(function(o) {
            return { x: o.x, y: o.y };
        });

        Parent.prototype.createSpawnPoints.call(this, points);
    };

    TiledLevel.prototype.gatherOptions = function(tiledObject) {
        var options = {};

        options.name = tiledObject.name;
        options.rotation = tiledObject.rotation;
        options.width = tiledObject.width / Settings.TILE_RATIO;
        options.height = tiledObject.height / Settings.TILE_RATIO;
        options.x = (tiledObject.x + tiledObject.width / 2) / Settings.TILE_RATIO;
        options.y = (tiledObject.y + options.height / 2) / Settings.TILE_RATIO;

        if (!options.width) options.width = undefined;
        if (!options.height) options.height = undefined;

        var defaultOptions = this.getDefaultItemSettingsByName(options.name);

        options = Options.merge(options, defaultOptions);

        return options;
    };


    TiledLevel.prototype.getDefaultItemSettingsByName = function(name) {

        if(!name) {
            throw new Exception('Item name cannot be be empty');
        }

        if(ItemSettings[name] === undefined) {
            throw new Exception('Item name (' + name + ') cannot be found in item list');
        }

        var options = ItemSettings.Default;

        options = Options.merge(ItemSettings[name], options);

        return options;
    };

    TiledLevel.prototype.getTileImagePath = function(gid) {
        for (var i = 0; i < this.levelData.tilesets.length; i++) {
            var tileset = this.levelData.tilesets[i];
            var offset = tileset.firstgid;
            if(gid >= offset && gid < offset + Object.keys(tileset.tiles).length) {
                return tileset.tiles["" + (gid - offset)].image;
            }
        }
    }

    return TiledLevel;
})