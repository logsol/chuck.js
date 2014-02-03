define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard"

], function (Settings, Box2D, NotificationCenter, CollisionDetector, Tile, Item, Skateboard) {
    
    function Level (uid, engine, gameObjects) {
        this.uid = uid;
        this.engine = engine;
        this.levelObject = null;
        this.gameObjects = gameObjects;
        this.load(this.uid);
    }

    Level.prototype.load = function (uid) {
        var self = this;
        var path = Settings.MAPS_PATH + uid + ".json"
        this.loadLevelDataFromPath(path, function(levelData) {
            self.createTiles(levelData);
            //self.createItems(levelData);
            NotificationCenter.trigger("game/level/loaded");
        });
    }

    Level.prototype.destroy = function () {
        for (var key in this.gameObjects) {
            for (var i = 0; i < this.gameObjects[key].length; i++) {
                this.gameObjects[key][i].destroy();
            }
            //this.gameObjects[key] = [];
        }
    }

    Level.prototype.createTiles = function (levelData) {

        if (!levelData || !levelData.tiles || levelData.tiles.length < 1) {
            throw "Level: Can't create physic tiles, no tiles found";
        }

        var tiles = levelData.tiles;

        for (var i = 0; i < tiles.length; i++) {
            var options = tiles[i];
            //options.m = this.tileAtPositionExists(options.x, options.y - 1) ? "Soil" : "GrassSoil";
            options.m = "Soil";
            this.gameObjects.fixed.push(new Tile(this.engine, "tile-" + i, options));
        }
    }

    Level.prototype.createItems = function(levelData) {
        if (!levelData || !levelData.items) {
            return;
        }
        var items = levelData.items;

        for (var i = 0; i < items.length; i++) {
            var options = items[i];
            var item;
            var uid = "item-" + i;

            switch(options.type) {
                case 'skateboard':
                    item = new Skateboard(this.engine, uid, options);
                    break;
                default:
                    item = new Item(this.engine, uid, options);
                    break
            }
            this.gameObjects.animated.push(item);            
        };
    };

    Level.prototype.getRandomSpawnPoint = function() {
        return {
            x: 150 + Math.random() * 300,
            y: 0
        };
    };

    return Level;
})