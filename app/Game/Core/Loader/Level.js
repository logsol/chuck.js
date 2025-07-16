define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Abstract",
    "Game/" + App.context + "/Collision/Detector",
    "Game/" + App.context + "/GameObjects/Tile",
    "Game/" + App.context + "/GameObjects/Item",
    "Game/" + App.context + "/GameObjects/Items/Skateboard",
    "Game/" + App.context + "/GameObjects/Items/RagDoll",
    "Game/" + App.context + "/GameObjects/Items/RubeDoll"

], function (Settings, Box2D, nc, Abstract, CollisionDetector, Tile, Item, Skateboard, RagDoll, RubeDoll) {
    
    "use strict";
    
    function Level (uid, engine) {
        this.uid = uid;
        this.engine = engine;
        this.levelObject = null;
        this.isLoaded = false;
        this.load(this.uid);
        this.spawnPoints = null;
    }

    Level.prototype.load = function (uid) {
        var self = this;
        // FIXME: check if theres a security hazard here (user injected path)
        var path = Settings.MAPS_PATH + uid + ".json";
        this.loadLevelDataFromPath(path, function (levelData) {
            self.setup(levelData);
        });
    };

    Level.prototype.setup = function(levelData) { // jshint unused:false
        this.isLoaded = true;
        nc.trigger(nc.ns.core.game.events.level.loaded);
    };

    Level.prototype.createItems = function(options) {
        for (var i = 0; i < options.length; i++) {
            var uid = "item-" + i;
            this.createItem(uid, options[i]);
        }
    };

    Level.prototype.createItem = function(uid, options) {

        switch(options.type) {
            case "skateboard":
                return new Skateboard(this.engine, uid, options);
            case "ragdoll":
                return new RagDoll(this.engine, uid, options);
            case "rubedoll":
                return new RubeDoll(this.engine, uid, options);
            default:
                return new Item(this.engine, uid, options);
        }
    };

    Level.prototype.createTiles = function(options) {
        for (var i = 0; i < options.length; i++) {
            new Tile(this.engine, "tile-" + i, options[i]);
        }
    };

    Level.prototype.createSpawnPoints = function(points) {
        this.spawnPoints = points;
    };

    Level.prototype.setupLayer = function(options, behind, referenceId) { // jshint unused:false
        // will be extended (so far only in client)
    };


    Level.prototype.createContainer = function(options) { // jshint unused:false
        // nothing to do here yet, in the future perhaps synchronize day/night graphics
    };

    Level.prototype.getRandomSpawnPoint = function() {
        if(!this.spawnPoints) {
            return {
                x: 150 + Math.random() * 300,
                y: -500
            };
        }

        var size = this.spawnPoints.length;
        var object = this.spawnPoints[parseInt(Math.random() * (size -1), 10)];

        return {
            x: object.x / Settings.TILE_RATIO,
            y: object.y / Settings.TILE_RATIO
        };
    };

    Level.prototype.destroy = function () {
        this.isLoaded = false;
    };

    return Level;
});