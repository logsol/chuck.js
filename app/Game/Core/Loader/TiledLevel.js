define([
    "Game/" + GLOBALS.context + "/Loader/Level",
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",

], function (Parent, Settings, Box2D, CollisionDetector, Tile, Item, Skateboard) {
    
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

        var collisionLayer = this.getLayer("collision");

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
        var objects = this.getLayer("items").objects;
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            var options = object.properties;
            options.x = object.x / Settings.TILE_RATIO;
            options.y = object.y / Settings.TILE_RATIO;
            var uid = "item-" + i;
            var item = this.createItem(uid, options);
            this.gameObjects.animated.push(item);  
        };
    };

    TiledLevel.prototype.getTileImagePath = function(gid) {
        //console.log(this.levelData.tilesets)
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

            var spawnLayer = this.getLayer("spawnpoints");

            var size = spawnLayer.objects.length;
            var object = spawnLayer.objects[parseInt(Math.random() * (size -1), 10)];

            return {
                x: object.x / Settings.TILE_RATIO,
                y: object.y / Settings.TILE_RATIO
            }

        }
    };

    TiledLevel.prototype.getLayer = function(name) {
        for (var i = 0; i < this.levelData.layers.length; i++) {
            if(this.levelData.layers[i].name === name) {
                return this.levelData.layers[i];
            }
        }

        throw "Layer '" + name + "' not found.";
    };

    return TiledLevel;
})