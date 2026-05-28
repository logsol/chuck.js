define([
	"Game/Core/GameObjects/Item",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Game/Client/View/Abstract/Layer"
],
 
function (Parent, Settings, nc, Layer) {

	"use strict";
 
    function Item(physicsEngine, uid, options) {
        this.layerId = Layer.ID.ITEM;
    	Parent.call(this, physicsEngine, uid, options);

        this.ncTokens = this.ncTokens.concat([
            nc.on(nc.ns.client.game.events.render, this.render, this)
        ]);
    }

    Item.prototype = Object.create(Parent.prototype);

    Item.prototype.setUpdateData = function(update) {
        var currentPos = this.body.GetPosition();
        var diffX = update.p.x - currentPos.x;
        var diffY = update.p.y - currentPos.y;
        var distance = Math.sqrt(diffX * diffX + diffY * diffY);
        var speed = Math.sqrt(update.lv.x * update.lv.x + update.lv.y * update.lv.y);

        this.body.SetAwake(true);

        if (distance > 3 || speed < 0.5) {
            // Stationary: sync so grab sensor contact is accurate.
            // Large error: snap for respawn/warp/grab events.
            this.body.SetPosition(update.p);
            this.body.SetAngle(update.a);
            this.body.SetLinearVelocity(update.lv);
            this.body.SetAngularVelocity(update.av);
        }
        // In-flight: skip correction entirely. Client and server both run the
        // same Box2D physics from the same throw impulse, so they stay close
        // without per-update snapping. Applying the server's stale state would
        // snap the item back to where it was 125 ms ago.
    };

    Item.prototype.createMesh = function() {
    	var self = this;

    	var texturePath = Settings.GRAPHICS_PATH
    				+ Settings.GRAPHICS_SUBPATH_ITEMS
    				+ this.options.category + '/'
    				+ this.options.image;

    	var callback = function(mesh) {
    		self.mesh = mesh;
            nc.trigger(nc.ns.client.view.mesh.add, self.layerId, mesh);
    	}
   
        nc.trigger(nc.ns.client.view.mesh.create,
            this.layerId,
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
        nc.trigger(nc.ns.client.view.mesh.remove, this.layerId, this.mesh);
        Parent.prototype.destroy.call(this);
    };

    Item.prototype.render = function() {

        nc.trigger(nc.ns.client.view.mesh.update,
            this.layerId,
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
            nc.trigger(nc.ns.client.view.mesh.update,
                this.layerId,
                this.mesh,
                {
                    xScale: direction
                }
            );
        }
    };
 
    return Item;
 
});