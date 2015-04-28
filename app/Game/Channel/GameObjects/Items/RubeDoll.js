define([
    "Game/Core/GameObjects/Items/RubeDoll",
   	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, Nc) {

    "use strict";
 
    function RubeDoll(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    }

    RubeDoll.prototype = Object.create(Parent.prototype);
 
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

    RubeDoll.prototype.destroy = function() {
        if(this.scheduledForDestruction) {
            clearTimeout(this.destructionTimeout);
        }
    	Parent.prototype.destroy.call(this);
    };
 
    return RubeDoll;
 
});