define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Game/" + GLOBALS.context + "/GameObjects/Items/Skateboard",

], function (Settings, Box2D, CollisionDetector, Tile, Item, Skateboard) {
    
    // Public
    function Level (path, engine, gameObjects) {
        this.path = path;
        this.engine = engine;
        this.levelObject = null;
        this.gameObjects = gameObjects;
    }

    Level.prototype.loadLevelInToEngine = function () {
        this.loadLevelObjectFromPath(this.path);
        this.createTiles();
        //this.createItems();
    }

    // Private

    Level.prototype.createTiles = function () {
        if (!this.levelObject || !this.levelObject.tiles || this.levelObject.tiles.length < 1) {
            throw "Level: Can't create physic tiles, no tiles found";
        }

        var tiles = this.levelObject.tiles;

        for (var i = 0; i < tiles.length; i++) {
            var options = tiles[i];
            options.m = this.tileAtPositionExists(options.x, options.y - 1) ? "Soil" : "GrassSoil";
            this.gameObjects.fixed.push(new Tile(this.engine, "tile-" + i, options));
        }
    }

    Level.prototype.loadLevelObjectFromPath = function (path) {
        
    }

    return Level;
})