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
        
        if (isHolding) {
            // throw
            if(item.isReleasingAllowed()) {
                this.throw(x, y, item);

                options.action = "throw";
                options.x = x;
                options.y = y;                
                NotificationCenter.trigger("broadcastGameCommand", "handActionResponse", options);
            }
        } else {
            // grab
            if(item.isGrabbingAllowed()) {
                this.grab(item); 

                options.action = "grab";
                NotificationCenter.trigger("broadcastGameCommand", "handActionResponse", options);
            }
        }
    };

    Player.prototype.addDamage = function(damage, enemy) {
        this.updateHealth(this.stats.health - damage);

        if(this.stats.health <= 0) {
            enemy.score();
            this.kill();
        }
    };

    Player.prototype.spawn = function(x, y) {
        Parent.prototype.spawn.call(this, x, y);
        this.updateHealth(100);
    };

    Player.prototype.updateHealth = function(health) {
        this.stats.health = health;
        NotificationCenter.trigger("user/" + this.id + "/gameCommand", "updateStats", {
            playerId: this.id,
            stats: this.stats
        });
    };

    Player.prototype.kill = function() {
        Parent.prototype.kill.call(this);
        this.stats.deaths++;
        this.broadcastStats();
    };

    Player.prototype.score = function() {
        this.stats.score++;
        this.broadcastStats();
    };

    Player.prototype.broadcastStats = function() {
        NotificationCenter.trigger("broadcastGameCommand", "updateStats", {
            playerId: this.id,
            stats: this.stats
        });
    };


 
    return Player;
 
});