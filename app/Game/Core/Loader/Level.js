define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile"

], function (Settings, Box2D, CollisionDetector, Tile) {
    
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
    }

    Level.prototype.unload = function () {
        // TODO unload level from engine if necessary
        // Perhaps just remove all bodies?
    }

    // Private

    Level.prototype.createTiles = function () {
        if (!this.levelObject || !this.levelObject.tiles || this.levelObject.tiles.length < 1) {
            throw "Level: Can't create physic tiles, no tiles found";
        }

        var tiles = this.levelObject.tiles;

        for (var i = 0; i < tiles.length; i++) {
            this.gameObjects.fixed.push(new Tile(this.engine, "tile-" + i, tiles[i]));
        }
    }

    Level.prototype.loadLevelObjectFromPath = function (path) {
        
        // TODO: load JSON levelObject from path
        // s: shape
        // x: x-position
        // y: y-position
        // r: rotation (optional)
        
        // Shapes:

        // 1
        // o o o
        // o o o
        // o o o

        // 2
        // o
        // o o
        // o o o

        // 3
        // o
        // o
        // o o

        // 4
        // o
        // o o o
        // o o o

        // 5
        // o
        // o
        // o o

        // 6
        //     o
        // o o o
        // o o o

        // 7
        //
        // o
        // o o

        // 8
        // o o
        // o o o
        // o o o

        this.levelObject = {
            tiles: [
{s:1, x:1, y:1, r:0},
{s:1, x:3, y:18},
{s:1, x:37, y:27},
{s:1, x:20, y:24},
{s:1, x:24, y:27},
{s:1, x:37, y:26},
{s:1, x:9, y:18},
{s:2, x:32, y:25, r:1},
{s:1, x:23, y:27},
{s:3, x:34, y:24, r:1},
{s:1, x:35, y:28},
{s:4, x:17, y:21},
{s:2, x:21, y:24},
{s:2, x:42, y:23, r:3},
{s:3, x:30, y:24, r:3},
{s:2, x:22, y:25},
{s:1, x:40, y:25},
{s:1, x:38, y:26},
{s:1, x:8, y:18},
{s:1, x:38, y:25},
{s:1, x:28, y:28},
{s:1, x:36, y:27},
{s:1, x:7, y:18},
{s:2, x:20, y:23},
{s:2, x:43, y:23, r:1},
{s:6, x:31, y:24},
{s:1, x:16, y:21},
{s:1, x:1, y:18},
{s:1, x:31, y:29},
{s:2, x:30, y:25, r:2},
{s:4, x:11, y:18},
{s:1, x:28, y:27},
{s:1, x:28, y:26},
{s:1, x:28, y:29},
{s:1, x:19, y:23},
{s:5, x:12, y:18, r:1},
{s:1, x:42, y:24},
{s:6, x:33, y:24, r:2},
{s:1, x:39, y:25},
{s:1, x:33, y:29},
{s:1, x:29, y:29},
{s:1, x:21, y:25},
{s:1, x:27, y:27},
{s:5, x:16, y:20, r:1},
{s:1, x:5, y:18},
{s:5, x:18, y:21, r:1},
{s:4, x:13, y:19},
{s:1, x:14, y:20},
{s:1, x:30, y:29},
{s:1, x:4, y:18},
{s:1, x:6, y:18},
{s:1, x:2, y:18},
{s:1, x:32, y:24},
{s:1, x:34, y:29},
{s:1, x:32, y:29},
{s:2, x:1, y:16},
{s:1, x:10, y:18},
{s:1, x:42, y:25},
{s:2, x:28, y:25, r:3},
{s:2, x:0, y:16, r:2},
{s:1, x:22, y:27},
{s:1, x:25, y:27},
{s:1, x:31, y:25},
{s:5, x:14, y:19, r:1},
{s:1, x:41, y:25},
{s:1, x:36, y:28},
{s:4, x:15, y:20},
{s:2, x:19, y:22},
{s:3, x:26, y:26, r:3},
{s:1, x:26, y:27},
{s:1, x:18, y:22},
{s:6, x:27, y:26},
{s:1, x:22, y:26},
{s:1, x:1, y:17},
{s:1, x:35, y:29},
{s:1, x:12, y:19}

                            ]
        }
    }

    return Level;
})