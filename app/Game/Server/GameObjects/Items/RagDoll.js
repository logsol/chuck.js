define([
	"Game/Core/GameObjects/Items/RagDoll",
	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, NotificationCenter) {
 
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
        this.scheduledForDestruction = true;
        this.destructionTimeout = setTimeout(this.destroy.bind(this), Settings.RAGDOLL_DESTRUCTION_TIME * 1000);
    };

    RagDoll.prototype.destroy = function() {
    	NotificationCenter.trigger("broadcastGameCommand", 'removeGameObject', {
    		type: 'animated',
    		uid: this.uid
    	});
    	Parent.prototype.destroy.call(this);
    };
 
    return RagDoll;
 
});