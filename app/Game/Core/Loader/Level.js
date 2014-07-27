define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Abstract",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",
    "Game/" + GLOBALS.context + "/GameObjects/Items/RagDoll",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Rube"

], function (Settings, Box2D, Nc, Abstract, CollisionDetector, Tile, Item, Skateboard, RagDoll, Rube) {
    
    function Level (uid, engine) {
        this.uid = uid;
        this.engine = engine;
        this.levelObject = null;
        this.isLoaded = false;
        this.load(this.uid);
    }

    Abstract.prototype.addMethod.call(Level, "createTiles");
    Abstract.prototype.addMethod.call(Level, "createItems");
    Abstract.prototype.addMethod.call(Level, "addBackground");

    Level.prototype.load = function (uid) {
        var self = this;
        var path = Settings.MAPS_PATH + uid + ".json"
        this.loadLevelDataFromPath(path, function (levelData) {
            self.setup(levelData);
        });
    }

    Level.prototype.setup = function(levelData) {
        this.levelData = levelData;
        this.createTiles();
        this.createItems();
        this.isLoaded = true;
        Nc.trigger(Nc.ns.core.game.events.level.loaded);
    };

    Level.prototype.createItem = function(uid, options) {
        switch(options.type) {
            //case 'skateboard':
            //    return new Skateboard(this.engine, uid, options);
            case 'ragdoll':
                return new RagDoll(this.engine, uid, options);
            case 'rube':
                return new Rube(this.engine, uid, options);
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

    Level.prototype.destroy = function () {
        this.isLoaded = false;
    }

    return Level;
})