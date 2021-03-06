define([
	"Game/Core/GameObjects/Items/RagDoll",
	"Game/Core/GameObjects/Item",
	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter",
    "Game/Client/View/Abstract/Layer"
],
 
function (Parent, CoreItem, Settings, nc, Layer) {

	"use strict";
 
    function RagDoll(physicsEngine, uid, options) {
        this.layerId = Layer.ID.SPAWN;
    	this.limbMeshes = {};
    	this.baseMeshName = "chest";
    	this.characterName = "Chuck";

    	Parent.call(this, physicsEngine, uid, options);
    }

    RagDoll.prototype = Object.create(Parent.prototype);

    RagDoll.prototype.createMesh = function() {
        for(var name in this.options.limbs) {
            this.createLimbMesh(name);
        }
    };

    RagDoll.prototype.createLimbMesh = function(name) {
    	var self = this;
    	var texturePath = Settings.GRAPHICS_PATH 
    		+ Settings.GRAPHICS_SUBPATH_CHARACTERS + '/' 
    		+ this.characterName + '/';

    	var callback = function(mesh) {
    		if(name == self.baseMeshName) {
    			self.mesh = mesh;
    		} else {
				self.limbMeshes[name] = mesh;
    		}
    		
            nc.trigger(nc.ns.client.view.mesh.add, self.layerId, mesh);
    	}
   
        nc.trigger(nc.ns.client.view.mesh.create,
            this.layerId,
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
			        nc.trigger(nc.ns.client.view.mesh.update,
                        this.layerId,
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
            nc.trigger(nc.ns.client.view.mesh.update,
                this.layerId,
                this.mesh,
                {
                    xScale: direction
                }
            );

            for (var name in this.limbMeshes) {
            	nc.trigger(nc.ns.client.view.mesh.update,
                    this.layerId,
	                this.limbMeshes[name],
	                {
	                    xScale: direction
	                }
	            );
            };
        }
    };

    RagDoll.prototype.destroy = function() {
        
        for (var name in this.limbMeshes) {
            nc.trigger(nc.ns.client.view.mesh.remove, this.layerId, this.limbMeshes[name]);
        };

        Parent.prototype.destroy.call(this);
    };
 
    return RagDoll;
 
});