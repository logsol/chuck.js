define([
    "Game/Core/Loader/DebugLevel",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Vendor/Pixi",
    "Game/Client/View/Abstract/Layer"
],

function (Parent, Settings, nc, PIXI, AbstractLayer) {

    "use strict";

    function DebugLevel (uid, engine, gameObjects) {
        this.levelSize = {
            width: 30 * Settings.TILE_SIZE,
            height: 20 * Settings.TILE_SIZE
        };
        
        // Set level size before parent setup
        nc.trigger(nc.ns.client.view.layer.levelSizeUpdate, this.levelSize);
        
        Parent.call(this, uid, engine, gameObjects);
    }

    DebugLevel.prototype = Object.create(Parent.prototype);

    DebugLevel.prototype.setup = function() {
        console.log("Setting up debug level (client) - loading minimal assets");
        
        // Load minimal assets needed for debug mode
        this.loadDebugAssets(function() {
            // Create the required layers before parent setup
            this.createRequiredLayers();
            
            // Call parent setup after assets are loaded
            Parent.prototype.setup.call(this);
        }.bind(this));
    };

    DebugLevel.prototype.createRequiredLayers = function() {
        console.log("Creating debug layers");
        
        // Create the tile layer (required for tile rendering)
        nc.trigger(
            nc.ns.client.view.layer.createAndInsert,
            AbstractLayer.ID.TILE, // "tile"
            {
                parallaxSpeed: 0.0,
                levelSize: this.levelSize
            },
            true, // behind
            null  // no reference
        );
        
        // Create the spawn layer (required for spawn points)
        nc.trigger(
            nc.ns.client.view.layer.createAndInsert,
            AbstractLayer.ID.SPAWN, // "spawnpoints"
            {
                parallaxSpeed: 0.0,
                levelSize: this.levelSize
            },
            false, // in front
            AbstractLayer.ID.TILE // after tile layer
        );
    };

    DebugLevel.prototype.loadDebugAssets = function(callback) {
        var paths = this.getDebugAssetPaths();
        
        if (paths.length === 0) {
            callback();
            return;
        }

        var count = 0;
        var numPaths = paths.length;
        var loader = new PIXI.AssetLoader(paths);
        
        loader.onComplete = function() { 
            console.log("Debug assets loaded successfully");
            callback(); 
        };
        
        loader.onProgress = function() { 
            var progress = parseInt(100 / numPaths * ++count, 10) + 1;
            nc.trigger(nc.ns.client.view.preloadBar.update, progress);
        };
        
        loader.load();
    };

    DebugLevel.prototype.getDebugAssetPaths = function() {
        var paths = [];

        // Load character assets (needed for player)
        var characterName = "Chuck";
        paths.push(
            Settings.GRAPHICS_PATH
            + Settings.GRAPHICS_SUBPATH_CHARACTERS
            + characterName
            + "/Animation/"
            + "/TexturePacker"
            + "/chuck_sheet.json"
        );

        paths.push(
            Settings.GRAPHICS_PATH 
            + Settings.GRAPHICS_SUBPATH_CHARACTERS 
            + characterName
            + "/head.png"
        );

        // Load the grass tile texture we're using
        paths.push("static/img/Tiles/GrassSoil/22.gif");

        return paths;
    };

    return DebugLevel;
}); 