define([
	"Game/Core/Loader/TiledLevel",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
],
 
function (Parent, Settings, Nc) {
 
    function TiledLevel(uid, engine, gameObjects) {
        this.layerId = "background";
    	Parent.call(this, uid, engine, gameObjects);
    }

    TiledLevel.prototype = Object.create(Parent.prototype);

    TiledLevel.prototype.setup = function(levelData) {
        /*
        FIXME: find a name for this shit!
        for (var i = 0; i < levelData.layers.length; i++) {
            var layerOptions = levelData.layers[i];
            layerOptions.z = i;
            if(!this.layerMapping[layerOptions.name]) {
                this.createLayer(layerOptions);
            }
        };
        */
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

        // FIXME: iterate through image layers and add images
        var background = this.getLayer(levelData, "background");
        paths.push(Settings.MAPS_PATH + background.image);

        return paths;
    }

    TiledLevel.prototype.setupLayer = function(options, behind, referenceId) {
        
        Parent.prototype.setupLayer.call(this, options, behind, referenceId);

        // So far only one image per layer is possible because of Tiled editor
        if (options.type == "imagelayer") {

            var texturePath = Settings.MAPS_PATH + options.image;

            var callback = function(mesh) {
                Nc.trigger(Nc.ns.client.view.mesh.add, options.layerId, mesh);
                Nc.trigger(Nc.ns.client.view.mesh.update, options.layerId, mesh, {
                    x: Settings.STAGE_WIDTH / 2,
                    y: Settings.STAGE_HEIGHT / 2,
                    pivot: {
                        x: mesh.texture.width / 2,
                        y: mesh.texture.height / 2
                    }
                });
            }
       
            Nc.trigger(Nc.ns.client.view.mesh.create,
                options.layerId,
                texturePath, 
                callback
            );
        }

    };

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