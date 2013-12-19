define([
	"Game/Core/GameObjects/Tile",
	"Game/Config/Settings"
],
 
function (Parent, Settings) {
 
    function Tile(physicsEngine, view, options) {
    	Parent.call(this, physicsEngine, view, options);
    }

    Tile.prototype = Object.create(Parent.prototype);

    Tile.prototype.createMesh = function() {
    	var self = this;

    	var material = "Stones";
    	var imgPath = Settings.GRAPHICS_PATH
    				+ Settings.GRAPHICS_SUBPATH_TILES
    				+ material + '/'
    				+ this.options.s + ''
    				+ this.options.r + '.gif';

    	var callback = function(mesh) {
    		self.mesh = mesh;
    		self.view.addMesh(mesh);
    	}

    	this.view.createMesh(
    		Settings.TILE_SIZE, 
    		Settings.TILE_SIZE, 
    		0, 
    		0, 
    		imgPath, 
    		callback
    	);
    };

    Tile.prototype.render = function() {
    	this.view.updateMesh(this.mesh, {
    		x: this.options.x * Settings.TILE_SIZE,
    		y: this.options.y * Settings.TILE_SIZE,
    	})
    }
 
    return Tile;
 
});