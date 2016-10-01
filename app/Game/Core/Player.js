define([
    "Game/" + GLOBALS.context + "/GameObjects/Doll",
    "Game/" + GLOBALS.context + "/Control/PlayerController",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Lib/Utilities/ColorConverter",
    "Game/" + GLOBALS.context + "/GameObjects/SpectatorDoll",
    "Game/" + GLOBALS.context + "/GameObjects/Items/RubeDoll"
],

function (Doll, PlayerController, Settings, Nc, Exception, ColorConverter, SpectatorDoll, RubeDoll) {

	"use strict";

    function Player (id, physicsEngine, user, revealedGameController) {
        this.stats = {
            health: 100,
            deaths: 0,
            score: 0
        }

        this.user = user;
        this.physicsEngine = physicsEngine;
        this.playerController = null; // pre-initialise with null, because client/players don't get one
        this.doll;
        this.id = id;
        this.spawned = false;
        this.holdingItem = null;
        this.inBetweenRounds = true;
        this.spectatorDoll = new SpectatorDoll(this.physicsEngine, "spectatorDoll-" + this.id, this);
        this.revealedGameController = revealedGameController;
    }

    Player.prototype.getNickname = function() {
        return this.user.options.nickname;
    };

    Player.prototype.getActiveDoll = function() {
        if(this.spawned) {
            return this.doll;
        } else if (this.ragDoll) {
            return this.ragDoll;
        }
        return this.spectatorDoll;
    };

    Player.prototype.spawn = function (x, y) {
        this.doll = new Doll(this.physicsEngine, "doll-" + this.id, this);
        this.doll.spawn(x, y);
        this.spawned = true;
    }

    Player.prototype.isSpawned = function() {
        return this.spawned;
    };

    Player.prototype.getPosition = function () {
        return this.getActiveDoll().getPosition();
    }

    Player.prototype.getHeadPosition = function () {
        return this.getActiveDoll().getHeadPosition();
    }


    Player.prototype.move = function (direction) {
        if(!this.spawned) return false;
        this.doll.move(direction);
    }

    Player.prototype.stop = function () {
        if(!this.spawned) return false;
        this.doll.stop();
    }

    Player.prototype.jump = function () {
        if(!this.spawned) return false;
        this.doll.jump();
    }

    Player.prototype.jumpStop = function () {
        if(!this.spawned) return false;
        this.doll.jumpStop();
    }

    Player.prototype.lookAt = function (x, y) {
        if(!this.spawned) return false;
        // FIXME implement spectator movement here
        this.doll.lookAt(x, y);
    }

    Player.prototype.grab = function(item) {
        if(!this.spawned) return false;
        this.doll.grab(item);
        item.beingGrabbed(this);
        this.holdingItem = item;  
    };

    Player.prototype.throw = function(options, item) {
        if(!this.spawned) return false;
        this.doll.throw(item, options);
        item.beingReleased(this);
        this.holdingItem = null; 
    };

    Player.prototype.kill = function(killedByPlayer, ragDollId) {
        if(!this.spawned) return false;

        // FIXME: do something better then just respawn in GameController
        if(this.holdingItem) {
            var options = {
                x: 0,
                y: 0,
                av: 0
            };
            this.throw(options, this.holdingItem)
        }

        // prepare for creating the ragdoll

        var converter = new ColorConverter();
        var primaryColor = converter.getColorByName(this.getNickname());

        var options = {
            x: this.getPosition().x * Settings.RATIO, 
            y: this.getPosition().y * Settings.RATIO,
            category: "graveyard",
            grabAngle: -0.3,
            image: "chest.png",
            name: "RagDoll",
            rotation: 0,
            type: "rubedoll",
            weight: 3,
            width: 5,
            height: 12,
            primaryColor: primaryColor,
            direction: this.doll.lookDirection
        };

        var rubeDoll = new RubeDoll(this.physicsEngine, "rubeDoll-" + this.id + "-" + ragDollId, options);
        rubeDoll.setVelocities(this.doll.getVelocities());

        this.spawned = false;

        this.doll.destroy();
        this.doll = null;

        this.ragDoll = rubeDoll;
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

        // FIXME add destroy nc hook

        if(this.holdingItem) {
            var options = {
                x: 0,
                y: 0,
                av: 0
            };
            this.throw(options, this.holdingItem);
        }
        
        this.spectatorDoll.destroy();

        // doll destoys itself at the end cause its a gameobject
        // but on userLeft, the player has to destroy it.
        if(this.doll) {
            this.doll.destroy(); 
        }

        if(this.playerController) {
            this.playerController.destroy();
        }
    }

    Player.prototype.setInBetweenRounds = function(inBetweenRounds) {
        this.inBetweenRounds = inBetweenRounds;
    };

    Player.prototype.isInBetweenRounds = function() {
        return this.inBetweenRounds;
    };

    return Player;
});
