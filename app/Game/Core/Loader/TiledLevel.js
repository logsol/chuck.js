define([
    "Game/" + GLOBALS.context + "/Loader/Level",
    "Game/Config/Settings", 
    "Game/Config/ItemSettings",
    "Lib/Vendor/Box2D", 
    "Lib/Utilities/Options",
    "Lib/Utilities/Exception",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",

], function (Parent, Settings, ItemSettings, Box2D, Options, Exception, CollisionDetector, Tile, Item, Skateboard) {
    
    // Public
    function TiledLevel (path, engine, gameObjects) {

        this.levelData = null;
        Parent.call(this, path, engine, gameObjects);
    }

    TiledLevel.prototype = Object.create(Parent.prototype);

    TiledLevel.prototype.createTiles = function () {
        if (!this.levelData) {
            throw "Level: Can't create level, nothing found";
        }

        var collisionLayer = this.getLayer(this.levelData, "collision");

        if(collisionLayer) {

            for (var i = 0; i < collisionLayer.data.length; i++) {

                var gid = collisionLayer.data[i];
                if(gid === 0) continue;

                var imagePath = this.getTileImagePath(gid);

                
                var parts = imagePath.split("/");
                var tileType = parts[parts.length - 1].split(".")[0].split("");

                // FIXME rename s to shape, r to rotation etc.

                var options = {
                    s: parseInt(tileType[0], 10),
                    r: parseInt(tileType[1], 10),
                    t: imagePath,
                    x: i % collisionLayer.width,
                    y: parseInt(i / collisionLayer.height , 10)
                }

                this.gameObjects.fixed.push(new Tile(this.engine, "tile-" + i, options));
            }

        } else {
            console.warn("Level: No collision Layer given");
        }
    }

    TiledLevel.prototype.createItems = function() {
        var objects = this.getLayer(this.levelData, "items").objects;

        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];

            var options = this.gatherOptions(object);

            var uid = "item-" + i;
            var item = this.createItem(uid, options);
            this.gameObjects.animated.push(item);  
        };
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
        //options = Options.merge(tiledObject.properties, options);

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

    TiledLevel.prototype.getRandomSpawnPoint = function() {
        if(!this.levelData) {
            return Parent.prototype.getRandomSpawnPoint.call(this);
        } else {

            var spawnLayer = this.getLayer(this.levelData, "spawnpoints");

            var size = spawnLayer.objects.length;
            var object = spawnLayer.objects[parseInt(Math.random() * (size -1), 10)];

            return {
                x: object.x / Settings.TILE_RATIO,
                y: object.y / Settings.TILE_RATIO
            }

        }
    };

    TiledLevel.prototype.getLayer = function(levelData, name) {
        for (var i = 0; i < levelData.layers.length; i++) {
            if(levelData.layers[i].name === name) {
                return levelData.layers[i];
            }
        }

        throw "Layer '" + name + "' not found.";
    };

    return TiledLevel;
})