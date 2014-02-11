define([
	"Game/Core/GameObjects/Item",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, NotificationCenter) {
 
    function Item(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    }

    Item.prototype = Object.create(Parent.prototype);
 
    Item.prototype.createMesh = function() {
    	var self = this;

    	var texturePath = Settings.GRAPHICS_PATH
    				+ Settings.GRAPHICS_SUBPATH_ITEMS
    				+ this.options.category + '/'
    				+ this.options.image;

    	var callback = function(mesh) {
    		self.mesh = mesh;
            NotificationCenter.trigger("view/addMesh", mesh);
    	}
   
        NotificationCenter.trigger("view/createMesh",
            texturePath, 
            callback,
            {
                width: this.options.width, 
                height: this.options.height, 
                pivot: {
                    x: this.options.width / 2,
                    y: this.options.height
                }
            }
        );
    };

    Item.prototype.destroy = function() {
        NotificationCenter.trigger("view/removeMesh", this.mesh);
        Parent.prototype.destroy.call(this);
    };

    Item.prototype.render = function() {

        NotificationCenter.trigger("view/updateMesh",
            this.mesh,
            {
                x: this.body.GetPosition().x * Settings.RATIO,
                y: this.body.GetPosition().y * Settings.RATIO,
                rotation: this.body.GetAngle()
            }
        );
    }

    Item.prototype.flip = function(direction) {
        var oldFlipDirection = this.flipDirection;
        
        Parent.prototype.flip.call(this, direction);

        if(oldFlipDirection != direction) {
            NotificationCenter.trigger("view/updateMesh",
                this.mesh,
                {
                    xScale: direction
                }
            );
        }
    };
 
    return Item;
 
});