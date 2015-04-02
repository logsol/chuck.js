define([
	"Game/Core/GameObjects/Doll",
    "Game/Channel/GameObjects/Item",
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert"
],
 
function (Parent, Item, Box2D, Nc, Assert) {

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
            var otherBody = fixture.GetBody();
            if(otherBody) {
                var item = otherBody.GetUserData();
                if(item instanceof Item) {
                    var itemVelocity = item.body.GetLinearVelocity();
                    //var itemMass = item.body.GetMass();

                    var ownVelocity = this.body.GetLinearVelocity();

                    var b2Math = Box2D.Common.Math.b2Math;
                    var absItemVelocity = b2Math.AbsV(itemVelocity);
                    var min = 1;
                    
                    if(absItemVelocity.x > min || absItemVelocity.y > min) {
                        if(item.lastMoved && item.lastMoved.player != this.player) {

                            var collision = b2Math.SubtractVV(itemVelocity, ownVelocity);

                            // Tested max velocity banana: 50
                            var velocityDamage = collision.Length() / 50;

                            // Max weight of piano: 15
                            var weightDamage = item.options.weight / 15;

                            // Max danger of knife: 3
                            var dangerDamage = item.options.danger / 3;

                            var damage = velocityDamage * (weightDamage * 180 + dangerDamage * 80);

                            var callback = function() {
                                self.player.addDamage(damage, item.lastMoved.player, item);
                            };

                            Nc.trigger(Nc.ns.channel.engine.worldQueue.add, callback);
                        }
                    }

                    item.setLastMovedBy(this.player);
                }
            }
        }
    };

    Doll.prototype.updatePositionState = function(update) {
        if(!this.isAnotherPlayerNearby()) {
            Assert.number(update.p.x, update.p.y);
            Assert.number(update.lv.x, update.lv.y);
            this.body.SetAwake(true);
            this.body.SetPosition(update.p);
            this.body.SetLinearVelocity(update.lv);
        }
    };
 
    return Doll;

});