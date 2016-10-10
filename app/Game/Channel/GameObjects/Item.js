define([
	"Game/Core/GameObjects/Item",
    "Lib/Utilities/NotificationCenter",
],
 
function (Parent, nc) {

	"use strict";
 
    function Item(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    	this.heldByPlayers = [];
        this.lastMoved = null;

        this.ncTokens = (this.ncTokens || []).concat([
            nc.on(nc.ns.channel.events.game.player.clearFingerPrints, this.clearOfPlayerFingerPrints, this)
        ]);
    }

    Item.prototype = Object.create(Parent.prototype);
 
    Item.prototype.getLastMovedBy = function() {
        return this.lastMoved;
    }

    Item.prototype.setLastMovedBy = function(player) {

        if(player) {
            this.lastMoved = {
                player: player,
                timestamp: new Date()
            };
        } else {
            this.lastMoved = null;
        }
    };

    Item.prototype.isGrabbingAllowed = function(player) { // jshint unused:false
        return this.heldByPlayers.length === 0;
    };

    Item.prototype.beingGrabbed = function(player) {
    	Parent.prototype.beingGrabbed.call(this, player);

        if(this.isGrabbingAllowed(player)) {
            this.heldByPlayers.push(player);
            this.setLastMovedBy(null);
        }
    };

    Item.prototype.isReleasingAllowed = function(player) { // jshint unused:false
        return true;
    };

    Item.prototype.beingReleased = function(player) {
        Parent.prototype.beingReleased.call(this, player);

        if(this.isReleasingAllowed(player)) {
            var pos = this.heldByPlayers.indexOf(player);
            if(pos >= 0) {
                this.heldByPlayers.splice(pos, 1);
                this.setLastMovedBy(player);
            }            
        }
    };

    Item.prototype.clearOfPlayerFingerPrints = function(player) {
        if (this.getLastMovedBy() && this.getLastMovedBy().player === player) {
            console.checkpoint('Removing fingerprints from ' + this.options.image);
            this.setLastMovedBy(null);
        }
    };

	Item.prototype.onCollisionChange = function(isColliding, fixture) {

		if(isColliding) {
			var otherBody = fixture.GetBody();
			if(otherBody) {
				var otherItem = otherBody.GetUserData();
				if(otherItem instanceof Item) {
					if(!this.lastMoved && !otherItem.lastMoved) return;

					if(this.lastMoved && otherItem.lastMoved) {
						if(this.lastMoved.timestamp > otherItem.lastMoved.timestamp) {
							this.setLastMovedBy(otherItem.lastMoved.player);
						} else {
							otherItem.setLastMovedBy(this.lastMoved.player);
						}
					} else {
						if(!this.lastMoved) {
							this.setLastMovedBy(otherItem.lastMoved.player);
						} else {
							otherItem.setLastMovedBy(this.lastMoved.player);
						}
					}
				}
			}
		}
	};

    return Item;
 
});
