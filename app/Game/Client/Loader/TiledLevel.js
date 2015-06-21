define([
	"Game/Core/Loader/TiledLevel",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
],
 
function (Parent, Settings, Nc) {

	"use strict";
 
    function TiledLevel(uid, engine) {
        this.layerId = "background";
    	Parent.call(this, uid, engine);
    }

    TiledLevel.prototype = Object.create(Parent.prototype);

    TiledLevel.prototype.setup = function(levelData) {
        var tilesLayerData = this.getLayer(levelData, "tiles");
        this.levelSize = {
            width: tilesLayerData.width * Settings.TILE_SIZE,
            height: tilesLayerData.height * Settings.TILE_SIZE
        };

        Nc.trigger(Nc.ns.client.view.layer.levelSizeUpdate, this.levelSize);

        Parent.prototype.setup.call(this, levelData);
    };

    TiledLevel.prototype.getAssetPaths = function(levelData) {
    	var paths = Parent.prototype.getAssetPaths.call(this, levelData);

    	// Get tiles images
    	for (var i = 0; i < levelData.tilesets.length; i++) {
    		var tileset = levelData.tilesets[i];
    		for (var key in tileset.tiles) {
    			var imagePpath = tileset.tiles[key].image;
    			if(imagePpath) {
    				paths.push(Settings.MAPS_PATH + imagePpath);
    			}
    		}
    	};

    	// Get items images
    	var objects = this.getLayer(levelData, "items").objects;
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];

            var options = this.gatherOptions(object);

    		var texturePath = Settings.GRAPHICS_PATH
	    		+ Settings.GRAPHICS_SUBPATH_ITEMS
	    		+ options.category + '/'
	    		+ options.image;

	    	paths.push(texturePath);
        };

        for (var i = 0; i < levelData.layers.length; i++) {
            var layer = levelData.layers[i];
            if (layer.type == "imagelayer") {
                paths.push(Settings.MAPS_PATH + layer.image);
            }
        };

        return paths;
    }

    TiledLevel.prototype.setupLayer = function(options, behind, referenceId) {
        
        var self = this;

        Parent.prototype.setupLayer.call(this, options, behind, referenceId);

        // So far only one image per layer is possible because of Tiled editor
        if (options.type == "imagelayer") {

            var texturePath = Settings.MAPS_PATH + options.image;

            var callback = function(mesh) {
                Nc.trigger(Nc.ns.client.view.mesh.add, options.layerId, mesh);
                Nc.trigger(Nc.ns.client.view.mesh.update, options.layerId, mesh, {
                    x: 0,//self.levelData.width * Settings.TILE_SIZE / 2,
                    y: 0,//self.levelData.height * Settings.TILE_SIZE / 2,
                    pivot: {
                        x: mesh.texture.width / 2,
                        y: mesh.texture.height / 2
                    },
                    xScale: 1,
                    yScale: 1
                });
            }
       
            Nc.trigger(Nc.ns.client.view.mesh.create,
                options.layerId,
                texturePath, 
                callback,
                {
                    alpha: options.opacity
                }
            );
        }

        // Adding tiles without collision
        else if (options.type == "tilelayer" && options.name != "tiles") {
            this.createNonCollidingTiles(options);
        }

    };


    TiledLevel.prototype.createNonCollidingTiles = function(options) {

        var data = options.data;
        var tilesOptions = [];
        for (var i = 0; i < data.length; i++) {

            var gid = data[i];
            if(gid === 0) continue;

            var imagePath = this.getTileImagePath(gid);
            var parts = imagePath.split("/");
            var tileType = parts[parts.length - 1].split(".")[0].split("")

            var callback = function(mesh) {
                Nc.trigger(Nc.ns.client.view.mesh.add, options.layerId, mesh);
            }
       
            Nc.trigger(Nc.ns.client.view.mesh.create,
                options.layerId,
                Settings.MAPS_PATH + imagePath,
                callback,
                {
                    width: Settings.TILE_SIZE, 
                    height: Settings.TILE_SIZE,
                    x: (i % options.width) * Settings.TILE_SIZE,
                    y: parseInt(i / options.width , 10) * Settings.TILE_SIZE,
                }
            );
        }
    }

    TiledLevel.prototype.getLayer = function(levelData, name) {
        for (var i = 0; i < levelData.layers.length; i++) {
            if(levelData.layers[i].name === name) {
                return levelData.layers[i];
            }
        }

        throw "Layer '" + name + "' not found.";
    };

    return TiledLevel;
 
});