define([
	"Game/Core/GameObjects/Doll"
],
 
function (Parent) {
 
    function Doll(physicsEngine, uid, player) {
    	Parent.call(this, physicsEngine, uid, player);
    }

    Doll.prototype = Object.create(Parent.prototype);
 
    Doll.prototype.findCloseItem = function(x, y) {

    	function findItem(array) {
        	for (var i = 0; i < array.length; i++) {
        		var item = array[i];
        		if(item.isGrabbingAllowed(this.player)) {
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
 
    return Doll;
 
});