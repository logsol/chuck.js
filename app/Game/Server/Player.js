define([
	"Game/Core/Player",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, NotificationCenter) {
 
    function Player(id, physicsEngine) {
    	Parent.call(this, id, physicsEngine);
    }

    Player.prototype = Object.create(Parent.prototype);
 
    Player.prototype.handActionRequest = function(x, y) {

    	var item = null;
    	var isHolding = !!this.holdingItem;
        
        if (isHolding) {
            item = this.holdingItem;
        } else {
            item = this.doll.findCloseItem(x, y);
        }

        if(item) {

	        this.handAction(x, y, isHolding, item);

			var message = {
	            handActionResponse: {
	                playerId: this.id,
	                isHolding: isHolding,
	                itemUid: item.uid,
	                x: x, 
	                y: y
	            }
	        };
	        
	        NotificationCenter.trigger("sendControlCommandToAllUsers", "gameCommand", message);
        }
    }
 
    return Player;
 
});