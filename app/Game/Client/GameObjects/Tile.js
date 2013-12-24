define([
	"Game/Core/GameObjects/Tile",
	"Game/Config/Settings",
    "Game/Core/NotificationCenter"
],
 
function (Parent, Settings, NotificationCenter) {
 
    function Tile(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    }

    Tile.prototype = Object.create(Parent.prototype);

    Tile.prototype.createMesh = function() {
    	var self = this;

    	var material = "Stones";
    	var texturePath = Settings.GRAPHICS_PATH
    				+ Settings.GRAPHICS_SUBPATH_TILES
    				+ material + '/'
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
                height: Settings.TILE_SIZE, 
                pivot: "mb"
            }
        );
    };

    Tile.prototype.render = function() {

        NotificationCenter.trigger("view/updateMesh",
            this.mesh,
            {
                x: this.options.x * Settings.TILE_SIZE,
                y: this.options.y * Settings.TILE_SIZE,
            }
        );
    }
 
    return Tile;
 
});