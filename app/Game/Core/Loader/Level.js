define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",
    "Game/" + GLOBALS.context + "/GameObjects/Items/RagDoll"

], function (Settings, Box2D, Nc, Exception, CollisionDetector, Tile, Item, Skateboard, RagDoll) {
    
    function Level (uid, engine, gameObjects) {
        this.uid = uid;
        this.engine = engine;
        this.levelObject = null;
        this.gameObjects = gameObjects;
        this.isLoaded = false;
        this.load(this.uid);
    }

    Level.prototype.load = function (uid) {
        var self = this;
        var path = Settings.MAPS_PATH + uid + ".json"
        this.loadLevelDataFromPath(path, function(levelData) {
            self.levelData = levelData;
            self.createTiles();
            self.createItems();
            self.isLoaded = true;
            Nc.trigger("game/level/loaded");
        });
    }

    Level.prototype.destroy = function () {
        for (var key in this.gameObjects) {
            for (var i = 0; i < this.gameObjects[key].length; i++) {
                this.gameObjects[key][i].destroy();
            }
        }
        this.isLoaded = false;
    }

    Level.prototype.createTiles = function () {

        if (!this.levelData || !this.levelData.tiles || this.levelData.tiles.length < 1) {
            throw "Level: Can't create physic tiles, no tiles found";
        }

        var tiles = this.levelData.tiles;

        for (var i = 0; i < tiles.length; i++) {
            var options = tiles[i];
            //options.m = this.tileAtPositionExists(options.x, options.y - 1) ? "Soil" : "GrassSoil";
            options.m = "Soil";
            this.gameObjects.fixed.push(new Tile(this.engine, "tile-" + i, options));
        }
    }

    Level.prototype.createItems = function() {
        if (!this.levelData || !this.levelData.items) {
            return;
        }
        var items = this.levelData.items;

        for (var i = 0; i < items.length; i++) {
            var options = items[i];
            var uid = "item-" + i;
            var item = this.createItem(uid, options);
            this.gameObjects.animated.push(item); // FIXME: use Nc
        };
    };

    Level.prototype.createItem = function(uid, options) {
        switch(options.type) {
            case 'skateboard':
                return new Skateboard(this.engine, uid, options);
            case 'ragdoll':
                return new RagDoll(this.engine, uid, options);
            default:
                return new Item(this.engine, uid, options);
        }
    };

    Level.prototype.getRandomSpawnPoint = function() {
        throw new Error("Level not loaded.");
        return {
            x: 150 + Math.random() * 300,
            y: -500
        };
    };

    return Level;
})