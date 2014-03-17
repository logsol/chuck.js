define([
	"Game/Core/GameObjects/Tile",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, Nc) {
 
    function Tile(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    }

    Tile.prototype = Object.create(Parent.prototype);

    Tile.prototype.createMesh = function() {
    	var self = this;

        /*
    	var texturePath = Settings.GRAPHICS_PATH
    				+ Settings.GRAPHICS_SUBPATH_TILES
    				+ this.options.m + '/'
    				+ this.options.s + ''
    				+ (this.options.r || 0) + '.gif';
                    */
                    
        var texturePath = Settings.MAPS_PATH + this.options.t;

    	var callback = function(mesh) {
    		self.mesh = mesh;
            Nc.trigger(Nc.ns.client.view.mesh.add, mesh);
    	}
   
        Nc.trigger(Nc.ns.client.view.mesh.create,
            texturePath, 
            callback,
            {
                width: Settings.TILE_SIZE, 
                height: Settings.TILE_SIZE,
                pivot: {
                    x: Settings.TILE_SIZE / 2 * Settings.TILE_RATIO,
                    y: Settings.TILE_SIZE / 2 * Settings.TILE_RATIO
                }
            }
        );
    };

    Tile.prototype.destroy = function() {
        Nc.trigger(Nc.ns.client.view.mesh.remove, this.mesh);
        Parent.prototype.destroy.call(this);
    };

    Tile.prototype.render = function() {

        Nc.trigger(Nc.ns.client.view.mesh.update,
            this.mesh,
            {
                x: this.body.GetPosition().x * Settings.RATIO,
                y: this.body.GetPosition().y * Settings.RATIO
            }
        );
    }
 
    return Tile;
 
});