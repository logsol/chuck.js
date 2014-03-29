define([
    "Game/" + GLOBALS.context + "/GameObjects/Doll",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/" + GLOBALS.context + "/GameObjects/SpectatorDoll",
    "Game/" + GLOBALS.context + "/GameObjects/Items/RagDoll"
],


function (Doll, Settings, Nc, Exception, SpectatorDoll, RagDoll) {

    function Player (id, physicsEngine, user) {
        this.stats = {
            health: 100,
            deaths: 0,
            score: 0
        }

        this.user = user;
        this.physicsEngine = physicsEngine;
        this.playerController = null;
        this.doll;
        this.id = id;
        this.isSpawned = false;
        this.holdingItem = null;
        this.spectatorDoll = new SpectatorDoll(this.physicsEngine, "spectatorDoll-" + this.id, this);
    }

    Player.prototype.getActiveDoll = function() {
        if(this.isSpawned) {
            return this.doll;
        } else if (this.ragDoll) {
            return this.ragDoll;
        }
        return this.spectatorDoll;
    };

    Player.prototype.spawn = function (x, y) {
        this.doll = new Doll(this.physicsEngine, "doll-" + this.id, this);
        this.doll.spawn(x, y);
        this.isSpawned = true;
    }

    Player.prototype.getPosition = function () {
        return this.getActiveDoll().getPosition();
    }

    Player.prototype.getHeadPosition = function () {
        return this.getActiveDoll().getHeadPosition();
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

    Player.prototype.jumpStop = function () {
        if(!this.isSpawned) return false;
        this.doll.jumpStop();
    }

    Player.prototype.lookAt = function (x, y) {
        if(!this.isSpawned) return false;
        // FIXME implement spectator movement here
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

    Player.prototype.kill = function(killedByPlayer, ragDollId) {
        if(!this.isSpawned) return false;

        // FIXME: do something better then just respawn in GameController
        if(this.holdingItem) {
            this.throw(0, 0, this.holdingItem)
        }

        // get forces
        var options = {
            x: this.getPosition().x * Settings.RATIO, 
            y: this.getPosition().y * Settings.RATIO,
            category: "graveyard",
            grabAngle: -0.3,
            image: "chest.png",
            name: "RagDoll",
            rotation: 0,
            type: "ragdoll",
            weight: 3,
            width: 5,
            height: 12
        };

        var ragDoll = new RagDoll(this.physicsEngine, "ragDoll-" + this.id + "-" + ragDollId, options);
        ragDoll.setVelocities(this.doll.getVelocities());

        this.isSpawned = false;

        this.doll.destroy();
        this.doll = null;

        this.ragDoll = ragDoll;
        

        Nc.trigger(Nc.ns.core.game.player.killed, this, killedByPlayer);
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
        
        this.spectatorDoll.destroy();
        if(this.doll) this.doll.destroy();
    }

    Player.prototype.setPlayerController = function(playerController) {
        this.playerController = playerController;
    }

    return Player;
});
