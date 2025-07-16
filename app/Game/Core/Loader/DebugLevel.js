define([
    "Game/Config/Settings", 
    "Lib/Vendor/Planck",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Abstract",
    "Game/" + GLOBALS.context + "/GameObjects/Tile"
], function (Settings, planck, nc, Abstract, Tile) {
    
    "use strict";
    
    function DebugLevel (uid, engine) {
        this.uid = uid;
        this.engine = engine;
        this.isLoaded = false;
        this.spawnPoints = null;
        this.setup();
    }

    DebugLevel.prototype.setup = function() {
        console.log("Setting up debug level - creating simple platform");
        
        // Create a simple platform in the middle of the screen
        this.createSimplePlatform();
        this.createSimpleSpawnPoints();
        
        this.isLoaded = true;
        nc.trigger(nc.ns.core.game.events.level.loaded);
    };

    DebugLevel.prototype.createSimplePlatform = function() {
        // Create a simple horizontal platform with grass on top, soil underneath
        var platformTiles = [
            // Top layer - grass tiles at y=8 (extended to the left)
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 6, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 7, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 8, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 9, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 10, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 11, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 12, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 13, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 14, y: 8},
            {s: 1, r: 0, t: "../../img/Tiles/GrassSoil/10.gif", x: 15, y: 8},
            
            // Bottom layer - soil tiles at y=9 (extended to the left)
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 6, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 7, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 8, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 9, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 10, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 11, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 12, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 13, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 14, y: 9},
            {s: 1, r: 0, t: "../../img/Tiles/Soil/10.gif", x: 15, y: 9}
        ];

        console.log("Creating " + platformTiles.length + " debug tiles (grass + soil)");
        
        for (var i = 0; i < platformTiles.length; i++) {
            var tileData = platformTiles[i];
            var tileUid = "debug_tile_" + i;
            new Tile(this.engine, tileUid, tileData);
        }
    };

    DebugLevel.prototype.createSimpleSpawnPoints = function() {
        // Create spawn points above the platform - spawn at y=5 (above y=8 tiles)
        this.spawnPoints = [
            {x: 12 * Settings.TILE_SIZE, y: 5 * Settings.TILE_SIZE},
            {x: 15 * Settings.TILE_SIZE, y: 5 * Settings.TILE_SIZE},
            {x: 18 * Settings.TILE_SIZE, y: 5 * Settings.TILE_SIZE}
        ];
    };

    DebugLevel.prototype.createTiles = function(options) {
        console.log("Creating " + options.length + " debug tiles");
        for (var i = 0; i < options.length; i++) {
            new Tile(this.engine, "debug-tile-" + i, options[i]);
        }
    };

    DebugLevel.prototype.getRandomSpawnPoint = function() {
        if(!this.spawnPoints || this.spawnPoints.length === 0) {
            return {
                x: 15 * Settings.TILE_SIZE,
                y: 10 * Settings.TILE_SIZE
            };
        }

        var size = this.spawnPoints.length;
        var object = this.spawnPoints[parseInt(Math.random() * size, 10)];

        return {
            x: object.x / Settings.TILE_RATIO,
            y: object.y / Settings.TILE_RATIO
        };
    };

    DebugLevel.prototype.destroy = function () {
        this.isLoaded = false;
    };

    return DebugLevel;
}); 