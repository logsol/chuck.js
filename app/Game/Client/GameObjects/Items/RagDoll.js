define([
	"Game/Core/GameObjects/Items/RagDoll",
	"Game/Core/GameObjects/Item",
	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, CoreItem, Settings, NotificationCenter) {
 
    function RagDoll(physicsEngine, uid, options) {
    	this.limbMeshes = {};
    	this.baseMeshName = "chest";
    	this.characterName = "Chuck";

    	Parent.call(this, physicsEngine, uid, options);
    }

    RagDoll.prototype = Object.create(Parent.prototype);

    RagDoll.prototype.createMesh = function() {
    	this.createLimbMesh("chest");
    	this.createLimbMesh("head");
    };

    RagDoll.prototype.createLimbMesh = function(name) {
    	var self = this;
    	var texturePath = Settings.GRAPHICS_PATH 
    		+ Settings.GRAPHICS_SUBPATH_CHARACTERS + '/' 
    		+ this.characterName + '/';

    	var callback = function(mesh) {
    		console.log(name, self.baseMeshName)
    		if(name == self.baseMeshName) {
    			self.mesh = mesh;
    		} else {
				self.limbMeshes[name] = mesh;
    		}
    		
            NotificationCenter.trigger("view/addMesh", mesh);
    	}
   
        NotificationCenter.trigger("view/createMesh",
            texturePath + name + ".png", 
            callback,
            {
                width: this.options.limbs[name].width, 
                height: this.options.limbs[name].height,
                pivot: {
                	x: this.options.limbs[name].width / 2,
                	y: this.options.limbs[name].height / 2
                }
            }
        );
    };

    RagDoll.prototype.render = function() {
    	Parent.prototype.render.call(this);

    	if(this.limbs) {
	    	for(var name in this.limbMeshes) {
	    		if(this.limbs[name]) {
			        NotificationCenter.trigger("view/updateMesh",
			            this.limbMeshes[name],
			            {
			                x: this.limbs[name].GetPosition().x * Settings.RATIO,
			                y: this.limbs[name].GetPosition().y * Settings.RATIO,
			                rotation: this.limbs[name].GetAngle()
			            }
			        );    			
	    		}
	    	}    		
    	}
    }

    RagDoll.prototype.flip = function(direction) {
        var oldFlipDirection = this.flipDirection;
        
        // Parent of parent
        CoreItem.prototype.flip.call(this, direction);

        if(oldFlipDirection != direction) {
            NotificationCenter.trigger("view/updateMesh",
                this.mesh,
                {
                    xScale: direction
                }
            );

            for (var name in this.limbMeshes) {
            	NotificationCenter.trigger("view/updateMesh",
	                this.limbMeshes[name],
	                {
	                    xScale: direction
	                }
	            );
            };
        }


    };
 
    return RagDoll;
 
});