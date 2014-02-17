define([
    "Game/" + GLOBALS.context + "/GameObjects/Doll",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter"
],


function (Doll, Settings, NotificationCenter) {

    function Player (id, physicsEngine) {
        this.stats = {
            health: 100,
            deaths: 0,
            score: 0
        }

        this.physicsEngine = physicsEngine;
        this.playerController = null;
        this.doll;
        this.id = id;
        this.isSpawned = false;
        this.holdingItem = null;
    }

    Player.prototype.getDoll = function() {
        return this.doll;
    };

    Player.prototype.spawn = function (x, y) {
        if(this.doll) {
            this.doll.destroy();
        }
        this.doll = new Doll(this.physicsEngine, "doll-" + this.id, this);
        this.doll.spawn(x, y);
        this.isSpawned = true;
    }

    Player.prototype.getPosition = function () {
        return this.doll.getPosition();
    }

    Player.prototype.getHeadPosition = function () {
        if(!this.isSpawned) return false;
        return this.doll.getHeadPosition();
    }


    Player.prototype.move = function (direction) {
        if(!this.isSpawned) return false;
        this.doll.move(direction);
    }

    Player.prototype.stop = function () {
        if(!this.isSpawned) return false;
        this.doll.stop();
    }

    Player.prototype.jump = function () {
        if(!this.isSpawned) return false;
        this.doll.jump();
    }

    Player.prototype.lookAt = function (x, y) {
        if(!this.isSpawned) return false;
        this.doll.lookAt(x, y);
    }

    Player.prototype.grab = function(item) {
        if(!this.isSpawned) return false;
        this.doll.grab(item);
        item.beingGrabbed(this);
        this.holdingItem = item;  
    };

    Player.prototype.throw = function(x, y, item) {
        if(!this.isSpawned) return false;
        this.doll.throw(item, x, y);
        item.beingReleased(this);
        this.holdingItem = null; 
    };

    Player.prototype.kill = function(killedByPlayer) {
        if(!this.isSpawned) return false;

        // FIXME: do something better then just respawn in GameController
        if(this.holdingItem) {
            this.throw(0, 0, this.holdingItem)
        }
        this.doll.kill();
        this.isSpawned = false;
        NotificationCenter.trigger("player/killed", this);
    };

    Player.prototype.update = function () {

        if(this.doll) {
            this.doll.update();
        }

        if(this.playerController) {
            this.playerController.update();
        }
    }

    Player.prototype.destroy = function () {
        if(this.holdingItem) {
            this.throw(0, 0, this.holdingItem);
        }
        this.doll.destroy();
    }

    Player.prototype.setPlayerController = function(playerController) {
        this.playerController = playerController;
    }

    return Player;
});
