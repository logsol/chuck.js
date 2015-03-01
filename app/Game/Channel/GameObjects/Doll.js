define([
	"Game/Core/GameObjects/Doll",
    "Game/Channel/GameObjects/Item",
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter"
],
 
function (Parent, Item, Box2D, Nc) {

	"use strict";
 
    function Doll(physicsEngine, uid, player) {
    	Parent.call(this, physicsEngine, uid, player);
    }

    Doll.prototype = Object.create(Parent.prototype);
 
    Doll.prototype.findCloseItem = function(x, y) {

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
    }

    Doll.prototype.onImpact = function(isColliding, fixture) {
        var self = this;

        Parent.prototype.onImpact.call(this, isColliding, fixture);

        if(isColliding) {
            var otherBody = fixture.GetBody();
            if(otherBody) {
                var item = otherBody.GetUserData();
                if(item instanceof Item) {
                    var itemVelocity = item.body.GetLinearVelocity();
                    var itemMass = item.body.GetMass();

                    var ownVelocity = this.body.GetLinearVelocity();

                    var b2Math = Box2D.Common.Math.b2Math;

                    var absItemVelocity = b2Math.AbsV(itemVelocity)
                    var max = 1;
                    
                    if(absItemVelocity.x > max || absItemVelocity.y > max) {
                        if(item.lastMoved && item.lastMoved.player != this.player) {
                            var damageVector = b2Math.SubtractVV(itemVelocity, ownVelocity);
                            damageVector.Abs();
                            var velocity = damageVector.Length();
                            damageVector.Multiply(itemMass / 3.6);
                            var damage = damageVector.Length();

                            if(item.options.danger) {
                                damage += item.options.danger * 90 * (velocity / 128) * (itemMass + 1);
                            }

                            var player = item.lastMoved.player;

                            var callback = function() {
                                self.player.addDamage(damage, player, item);
                            }

                            Nc.trigger(Nc.ns.channel.engine.worldQueue.add, callback)
                        }
                    }

                    item.setLastMovedBy(this.player);
                }
            }
        }
    }

    Doll.prototype.updatePositionState = function(update) {
        if(!this.isAnotherPlayerNearby()) {
            this.body.SetAwake(true);
            this.body.SetPosition(update.p);
            this.body.SetLinearVelocity(update.lv);
        }
    };
 
    return Doll;

});