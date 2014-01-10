define([
    "Game/Config/Settings", 
    "Lib/Vendor/Box2D", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Tile",
    "Game/" + GLOBALS.context + "/GameObjects/Item"

], function (Settings, Box2D, CollisionDetector, Tile, Item) {
    
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
        this.createItems();
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
            var options = tiles[i];
            options.m = this.tileAtPositionExists(options.x, options.y - 1) ? "Soil" : "GrassSoil";

            this.gameObjects.fixed.push(new Tile(this.engine, "tile-" + i, options));
        }
    }

    Level.prototype.createItems = function() {
        var items = this.levelObject.items;

        for (var i = 0; i < items.length; i++) {
            var options = items[i];

            this.gameObjects.animated.push(new Item(this.engine, "item-" + i, options));
        };
    };

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
            /*
Material densities (g/cm^3):

wood: 0.63
steel: 7.859
banana: 0.95
microwave: 3.744

            */
            items: [
                {
                    name:'Banana',
                    image:'banana.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight: 1,
                    width:5,
                    height:9,
                    depth: 3,
                    x:40,
                    y:0,
                    rotation: 0
                },
                {
                    name:'Refridgerator',
                    image:'fridge.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight: 10,
                    width:31,
                    height:53,
                    x:120,
                    y:0,
                    rotation: 0
                },
                {
                    name:'Microwave',
                    image:'microwave.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight: 4,
                    width:19,
                    height:12,
                    depth: 12,
                    x:100,
                    y:0,
                    rotation: 0
                },
                {
                    name:'Large Cleaver',
                    image:'cleaver_large.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight: 3,
                    width:8,
                    height:22,
                    x:40,
                    y:0,
                    rotation: 0
                },
                {
                    name:'Small Cleaver',
                    image:'cleaver_small.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight:2,
                    width:6,
                    height:17,
                    x:60,
                    y:0,
                    rotation: 0
                },
                {
                    name:'Coffeemachine',
                    image:'coffeemachine.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight:2.4,
                    width:11,
                    height:14,
                    x:80,
                    y:0,
                    rotation: 0
                },
                {
                    name:'Knife',
                    image:'knife.gif',
                    shape:'rectangle',
                    category:'kitchen',
                    weight:1.5,
                    width:4,
                    height:15,
                    x:140,
                    y:0,
                    rotation: 0
                }
            ],
            tiles: /*
            (function() {
                var tiles = [];
                for (var i = 0; i < 50; i++) {
                    tiles.push({
                        s:1,
                        x:i,
                        y:5
                    })
                };
                return tiles;
            })()
*/

            [
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

    // TODO remove hack
    Level.prototype.tileAtPositionExists = function(x, y) {

        for (var i = 0; i < this.levelObject.tiles.length; i++) {
            var o = this.levelObject.tiles[i];
            if(o.x == x && o.y == y) return true;
        }
        return false;
    };

    return Level;
})