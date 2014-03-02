define([
	"Game/Core/Player",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Nc) {
 
    function Player(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);
    }

    Player.prototype = Object.create(Parent.prototype);
 
    Player.prototype.handActionRequest = function(x, y) {
        if(!this.doll) return false;

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
                Nc.trigger("broadcastGameCommand", "handActionResponse", options);
            }
        } else {
            // grab
            if(item.isGrabbingAllowed()) {
                this.grab(item); 

                options.action = "grab";
                Nc.trigger("broadcastGameCommand", "handActionResponse", options);
            }
        }
    };

    Player.prototype.suicide = function() {
        this.addDamage(100, this);
    };

    Player.prototype.addDamage = function(damage, enemy) {
        this.stats.health -= damage;
        
        if(this.stats.health < 0) this.stats.health = 0;

        if(this.stats.health <= 0) {
            if(enemy != this) enemy.score();
            this.kill(enemy);
        } else {
            this.broadcastStats();
        }
    };

    Player.prototype.spawn = function(x, y) {
        Parent.prototype.spawn.call(this, x, y);
        this.stats.health = 100;
        this.broadcastStats();
    };

    Player.prototype.kill = function(killedByPlayer) {
        this.stats.deaths++;
        var ragDollId = this.stats.deaths;
        Parent.prototype.kill.call(this, killedByPlayer, ragDollId);

        this.broadcastStats();
        Nc.trigger("broadcastGameCommand", "playerKill", {
            playerId: this.id,
            killedByPlayerId: killedByPlayer.id,
            ragDollId: ragDollId
        });

        if(this.ragDoll) {
            this.ragDoll.delayedDestroy();
        }
    };

    Player.prototype.score = function() {
        this.stats.score++;
        this.broadcastStats();
    };

    Player.prototype.broadcastStats = function() {
        Nc.trigger("broadcastGameCommand", "updateStats", {
            playerId: this.id,
            stats: this.stats
        });
    };


 
    return Player;
 
});