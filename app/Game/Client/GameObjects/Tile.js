define([
	"Game/Core/GameObjects/Tile",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, NotificationCenter) {
 
    function Tile(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    }

    Tile.prototype = Object.create(Parent.prototype);

    Tile.prototype.createMesh = function() {
    	var self = this;

    	var texturePath = Settings.GRAPHICS_PATH
    				+ Settings.GRAPHICS_SUBPATH_TILES
    				+ this.options.m + '/'
    				+ this.options.s + ''
    				+ (this.options.r || 0) + '.gif';

    	var callback = function(mesh) {
    		self.mesh = mesh;
            NotificationCenter.trigger("view/addMesh", mesh);
    	}
   
        NotificationCenter.trigger("view/createMesh",
            texturePath, 
            callback,
            {
                width: Settings.TILE_SIZE, 
                height: Settings.TILE_SIZE
            }
        );
    };

    Tile.prototype.destroy = function() {
        NotificationCenter.trigger("view/removeMesh", this.mesh);
        Parent.prototype.destroy.call(this);
    };

    Tile.prototype.render = function() {

        NotificationCenter.trigger("view/updateMesh",
            this.mesh,
            {
                x: this.body.GetPosition().x * Settings.RATIO - Settings.TILE_SIZE / 2,
                y: this.body.GetPosition().y * Settings.RATIO - Settings.TILE_SIZE / 2
            }
        );
    }
 
    return Tile;
 
});