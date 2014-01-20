define([
	"Game/Core/GameObjects/Item"
],
 
function (Parent) {
 
    function Item(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    	this.heldByPlayers = [];
        this.lastMoved = null;
    }

    Item.prototype = Object.create(Parent.prototype);
 

    Item.prototype.setLastMovedBy = function(player) {

        if(player) {
            this.lastMoved = {
                player: player,
                timestamp: new Date()
            }
        } else {
            this.lastMoved = null;
        }
    };

    Item.prototype.isGrabbingAllowed = function(player) {
        return this.heldByPlayers.length == 0;
    };

    Item.prototype.beingGrabbed = function(player) {
    	Parent.prototype.beingGrabbed.call(this, player);

        if(this.isGrabbingAllowed(player)) {
            this.heldByPlayers.push(player);
            this.setLastMovedBy(null);
        }
    };

    Item.prototype.isReleasingAllowed = function(player) {
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

    return Item;
 
});
