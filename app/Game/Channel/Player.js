define([
	"Game/Core/Player",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Nc) {

	"use strict";
 
    function Player(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);
    }

    Player.prototype = Object.create(Parent.prototype);
 
    Player.prototype.handActionRequest = function(options) {
        if(!this.doll) return false;

    	var item = null;
    	var isHolding = !!this.holdingItem;
        
        if (isHolding) {
            item = this.holdingItem;
        } else {
            item = this.doll.findCloseItem(options.x);
        }

        if(item) {
	        this.handAction(options, isHolding, item);
        }
    };

    Player.prototype.handAction = function(options, isHolding, item) {

        options.playerId = this.id;
        options.itemUid = item.uid;
        
        if (isHolding) {
            // throw
            if(item.isReleasingAllowed()) {
                this.throw(options, item);

                options.action = "throw";
                Nc.trigger(Nc.ns.channel.to.client.gameCommand.broadcast, "handActionResponse", options);
            }
        } else {
            // grab
            if(item.isGrabbingAllowed()) {
                this.grab(item); 

                options.action = "grab";
                Nc.trigger(Nc.ns.channel.to.client.gameCommand.broadcast, "handActionResponse", options);
            }
        }
    };

    Player.prototype.suicide = function() {
        if(this.isSpawned()) {
            this.addDamage(100, this, null);            
        }
    };

    Player.prototype.addDamage = function(damage, enemy, byItem) {
        this.stats.health -= damage;
        
        if(this.stats.health < 0) this.stats.health = 0;
        
        this.broadcastStats();

        if(this.stats.health <= 0) {
            if(enemy != this) enemy.score();
            this.kill(enemy, byItem);
        }
    };

    Player.prototype.spawn = function(x, y) {
        Parent.prototype.spawn.call(this, x, y);
        this.stats.health = 100;
        this.broadcastStats();
    };

    Player.prototype.kill = function(killedByPlayer, byItem) {
        this.stats.deaths++;
        var ragDollId = this.stats.deaths;
        Parent.prototype.kill.call(this, killedByPlayer, ragDollId);

        Nc.trigger(Nc.ns.channel.to.client.gameCommand.broadcast, "playerKill", {
            playerId: this.id,
            killedByPlayerId: killedByPlayer.id,
            ragDollId: ragDollId,
            item: byItem ? byItem.options.name : "Suicide"
        });

        Nc.trigger(Nc.ns.channel.events.game.player.killed, this, killedByPlayer); // sends endround

        if(this.ragDoll) {
            this.ragDoll.delayedDestroy();
        }
    };

    Player.prototype.score = function() {
        this.stats.score++;
    };

    Player.prototype.broadcastStats = function() {
        Nc.trigger(Nc.ns.channel.to.client.gameCommand.broadcast, "updateStats", {
            playerId: this.id,
            stats: this.stats
        });
    };
    
 
    return Player;
 
});