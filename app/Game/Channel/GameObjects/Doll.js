define([
	"Game/Core/GameObjects/Doll",
    "Game/Channel/GameObjects/Item",
    "Lib/Vendor/Planck",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert"
],
 
function (Parent, Item, planck, nc, Assert) {

	"use strict";
 
    function Doll(physicsEngine, uid, player) {
    	Parent.call(this, physicsEngine, uid, player);
    }

    Doll.prototype = Object.create(Parent.prototype);
 
    Doll.prototype.findCloseItem = function(x) {

        var self = this;

    	function findItem(array) {
        	for (var i = 0; i < array.length; i++) {
        		var item = array[i];
        		if(item.isGrabbingAllowed(self.player)) {
        			return item;
        		}
        	}
    	}

        if (x < 0) { // looking left
        	return findItem(this.reachableItems.left);
        } else {
        	return findItem(this.reachableItems.right);
        }
    };

    Doll.prototype.onImpact = function(isColliding, fixture) {
        var self = this;

        Parent.prototype.onImpact.call(this, isColliding, fixture);

        if(isColliding) {
                            var otherBody = fixture.getBody();
            if(otherBody) {
                var item = otherBody.getUserData();
                if(item instanceof Item) {
                    var itemVelocity = item.body.getLinearVelocity();
                    //var itemMass = item.body.getMass();

                    var ownVelocity = this.body.getLinearVelocity();

                    var absItemVelocity = { x: Math.abs(itemVelocity.x), y: Math.abs(itemVelocity.y) };
                    var min = 1;
                    var damage = 0;
                    
                    if(absItemVelocity.x > min || absItemVelocity.y > min) {
                        if(item.lastMoved && item.lastMoved.player != this.player) {

                            var collision = planck.Vec2(itemVelocity).sub(planck.Vec2(ownVelocity));

                            // Tested max velocity banana: 50
                            var velocityDamage = collision.length() / 50;

                            // Max weight of piano: 15
                            var weightDamage = item.options.weight / 15;

                            // Max danger of knife: 3
                            var dangerDamage = item.options.danger / 3;

                            // + 0.5 and / 2: offsetting for lower velocity impact
                            // * 300: tested imperically by throwing piano from deadly height
                            // * 80: tested imperically by throwing knife fast
                            damage = (velocityDamage + 0.5) * (weightDamage * 300 + dangerDamage * 80) / 2;

                            var lastMovedPlayer = item.lastMoved.player;
                            var callback = function() {
                                self.player.addDamage(damage, lastMovedPlayer, item);
                            };

                            nc.trigger(nc.ns.channel.engine.worldQueue.add, callback);
                        }
                    }

                    // only set lastMovedBy if player wasn't hurt by collision
                    if (damage === 0) {
                        item.setLastMovedBy(this.player);
                    }
                }
            }
        }
    };

    Doll.prototype.updatePositionState = function(update) {
        if(!this.isAnotherPlayerNearby()) {
            Assert.number(update.p.x, update.p.y);
            Assert.number(update.lv.x, update.lv.y);
            this.body.setAwake(true);
            this.body.setPosition(update.p);
            this.body.setLinearVelocity(update.lv);
        }
    };

    Doll.prototype.getUpdateData = function(getSleeping) {

        var updateData = Parent.prototype.getUpdateData.call(this, getSleeping);

        if(updateData) {
            updateData.as = this.getActionState();
            updateData.laxy = this.lookAtXY;
        }

        return updateData;
    };
 
    return Doll;

});