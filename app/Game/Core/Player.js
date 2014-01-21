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
            kills: 0
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
        if(!this.doll) return false;
        return this.doll.getPosition();
    }

    Player.prototype.getHeadPosition = function () {
        if(!this.doll) return false;
        return this.doll.getHeadPosition();
    }


    Player.prototype.move = function (direction) {
        this.doll.move(direction);
    }

    Player.prototype.stop = function () {
        this.doll.stop();
    }

    Player.prototype.jump = function () {
        this.doll.jump();
    }

    Player.prototype.lookAt = function (x, y) {
        if(this.doll) this.doll.lookAt(x, y);
    }

    Player.prototype.grab = function(item) {
        item.beingGrabbed(this);
        this.doll.grab(item);
        this.holdingItem = item;  
    };

    Player.prototype.throw = function(x, y, item) {
        item.beingReleased(this);
        this.doll.throw(item, x, y);
        this.holdingItem = null; 
    };

    Player.prototype.kill = function(killedBy) {
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
        this.doll.destroy();
    }

    Player.prototype.setPlayerController = function(playerController) {
        this.playerController = playerController;
    }

    return Player;
});
