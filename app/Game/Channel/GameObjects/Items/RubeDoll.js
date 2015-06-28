define([
    "Game/Core/GameObjects/Items/RubeDoll",
   	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, Nc) {

    "use strict";
 
    function RubeDoll(physicsEngine, uid, options) {
        this.scheduledForDestruction = false;
        this.destructionTimeout = null;

    	Parent.call(this, physicsEngine, uid, options);
    }

    RubeDoll.prototype = Object.create(Parent.prototype);

    RubeDoll.prototype.beingGrabbed = function(player) {
        Parent.prototype.beingGrabbed.call(this, player);
        if(this.scheduledForDestruction) {
            clearTimeout(this.destructionTimeout);
        }
    };
 
    RubeDoll.prototype.beingReleased = function(player) {
        Parent.prototype.beingReleased.call(this, player);
        if(this.scheduledForDestruction) {
            this.delayedDestroy();
        }
    };

    RubeDoll.prototype.delayedDestroy = function() {
        var self = this;
        this.scheduledForDestruction = true;
        this.destructionTimeout = setTimeout(function() {
            Nc.trigger(Nc.ns.channel.to.client.gameCommand.broadcast, 'removeGameObject', {
                type: 'animated',
                uid: self.uid
            });
            self.destroy();
        }, Settings.RAGDOLL_DESTRUCTION_TIME * 1000);
    };

    RubeDoll.prototype.getUpdateData = function(getSleeping) {
        var updateData = Parent.prototype.getUpdateData.call(this, getSleeping);

        // if parent is asleep it sends null, to do no update
        if(!updateData) {
            return updateData;
        }

        // adding limb update data
        var limbUpdateData = {};

        for(var name in this.limbs) {
            limbUpdateData[name] = {
                p: this.limbs[name].GetPosition(),
                a: this.limbs[name].GetAngle(),
                lv: this.limbs[name].GetLinearVelocity(),
                av: this.limbs[name].GetAngularVelocity()
            };
        }
        updateData['limbs'] = limbUpdateData;

        return updateData;
    }

    RubeDoll.prototype.destroy = function() {
        if(this.scheduledForDestruction) {
            clearTimeout(this.destructionTimeout);
        }
    	Parent.prototype.destroy.call(this);
    };
 
    return RubeDoll;
 
});