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
        }
    }

    Player.prototype.handAction = function(x, y, isHolding, item) {

        var options = {
            playerId: this.id,
            itemUid: item.uid            
        }

        var message = {
            handActionResponse: options
        }
        
        if (isHolding) {
            // throw
            if(item.isReleasingAllowed()) {
                this.throw(x, y, item);

                options.action = "throw";
                options.x = x;
                options.y = y;                
                NotificationCenter.trigger("sendControlCommandToAllUsers", "gameCommand", message);
            }
        } else {
            // grab
            if(item.isGrabbingAllowed()) {
                this.grab(item); 

                options.action = "grab";
                NotificationCenter.trigger("sendControlCommandToAllUsers", "gameCommand", message);              
            }
        }
    };

    Player.prototype.addDamage = function(damage, enemy) {
        this.stats.health -= damage;
        if(this.stats.health <= 0) {
            this.stats.deaths++;
            enemy.stats.kills++;
            this.kill();
        }
    };
 
    return Player;
 
});