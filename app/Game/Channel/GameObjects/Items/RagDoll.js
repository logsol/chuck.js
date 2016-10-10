define([
	"Game/Core/GameObjects/Items/RagDoll",
	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, nc) {

	"use strict";
 
    function RagDoll(physicsEngine, uid, options) {
        this.scheduledForDestruction = false;
        this.destructionTimeout = null;

    	Parent.call(this, physicsEngine, uid, options);
    }

    RagDoll.prototype = Object.create(Parent.prototype);
 
    RagDoll.prototype.beingGrabbed = function(player) {
        Parent.prototype.beingGrabbed.call(this, player);
        if(this.scheduledForDestruction) {
            clearTimeout(this.destructionTimeout);
        }
    };

    RagDoll.prototype.beingReleased = function(player) {
        Parent.prototype.beingReleased.call(this, player);
        if(this.scheduledForDestruction) {
            this.delayedDestroy();
        }
    };

    RagDoll.prototype.delayedDestroy = function() {
        var self = this;
        this.scheduledForDestruction = true;
        this.destructionTimeout = setTimeout(function() {
            nc.trigger(nc.ns.channel.to.client.gameCommand.broadcast, 'removeGameObject', {
                type: 'animated',
                uid: self.uid
            });
            self.destroy();
        }, Settings.RAGDOLL_DESTRUCTION_TIME * 1000);
    };

    RagDoll.prototype.destroy = function() {
        if(this.scheduledForDestruction) {
            clearTimeout(this.destructionTimeout);
        }
    	Parent.prototype.destroy.call(this);
    };
 
    return RagDoll;
 
});