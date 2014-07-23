define([
	"Game/Core/Loader/TiledLevel",
	"Game/Config/Settings"
],
 
function (Parent, Settings) {
 
    function TiledLevel(uid, engine, gameObjects) {
    	Parent.call(this, uid, engine, gameObjects);
    }

    TiledLevel.prototype = Object.create(Parent.prototype);
 
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

        var background = this.getLayer(levelData, "background");
        paths.push(Settings.MAPS_PATH + background.image);

        return paths;

    }
 
    return TiledLevel;
 
});