define([
    "Game/Core/GameController",
    "Game/Channel/Physics/Engine",
    "Game/Config/Settings", 
    "Lib/Utilities/RequestAnimFrame",
    "Lib/Utilities/NotificationCenter",
    "Lib/Vendor/Box2D",
    "Game/Channel/Player",
    "Game/Channel/GameObjects/GameObject",
    "Game/Channel/GameObjects/Doll",
    "Game/Channel/GameObjects/Items/RubeDoll"
],

function (Parent, PhysicsEngine, Settings, requestAnimFrame, nc, Box2D, Player, GameObject, Doll, RubeDoll) {

	"use strict";

    function GameController (options) {

        this.animationTimeout = null;
        this.worldUpdateTimeout = null;
        this.spawnTimeouts = [];
        this.roundHasEnded = false;

        Parent.call(this, options);

        this.ncTokens = this.ncTokens.concat([
            nc.on(nc.ns.channel.events.user.joined, this.onUserJoined, this),
            nc.on(nc.ns.channel.events.user.left, this.onUserLeft, this),
            nc.on(nc.ns.channel.events.user.level.reset, this.onResetLevel, this),
            nc.on(nc.ns.channel.events.user.client.ready, this.onClientReady, this),
            nc.on(nc.ns.core.game.events.level.loaded, this.onLevelLoaded, this), 
            nc.on(nc.ns.channel.events.game.player.killed, this.onPlayerKilled, this),
        ]);

        console.checkpoint('starting game controller for channel (' + options.channelName + ')');
    }

    GameController.prototype = Object.create(Parent.prototype);

    GameController.prototype.update  = function () {

        Parent.prototype.update.call(this);

        this.animationTimeout = requestAnimFrame(this.update.bind(this));

        this.physicsEngine.update();
        for(var id in this.players) {
            this.players[id].update();
        }
    }

    GameController.prototype.onLevelLoaded = function() {
        this.updateWorld();
    };

    GameController.prototype.onUserJoined = function (user) {
        this.createPlayer(user);
    }

    GameController.prototype.onUserLeft = function (userId) {
        var player = this.players[userId];
        this.clearItemsOfPlayerFingerPrints(player);
        Parent.prototype.onUserLeft.call(this, userId);
    };

    GameController.prototype.clearItemsOfPlayerFingerPrints = function(player) {
        nc.trigger(nc.ns.channel.events.game.player.clearFingerPrints, player);
    };

    GameController.prototype.createPlayer = function(user) {

        var revealedGameController = {
            isInBetweenRounds: this.isInBetweenRounds.bind(this)
        }; 
        var player = Parent.prototype.createPlayer.call(this, user, revealedGameController);
        user.setPlayer(player);
    };

    GameController.prototype.onPlayerKilled = function(player, killedByPlayer) {
        if(killedByPlayer.stats.score >= this.options.scoreLimit) {
            nc.trigger(nc.ns.channel.events.round.end);
        } else {
            this.spawnPlayer(player, Settings.RESPAWN_TIME);
        }
    };

    GameController.prototype.spawnPlayer = function(player, respawnTime) {
        var self = this;
        var spawnPoint = this.level.getRandomSpawnPoint();

        respawnTime = typeof respawnTime == 'undefined' 
            ? Settings.RESPAWN_TIME
            : respawnTime;

        var spawnTimeout = setTimeout(function() {
            player.spawn(spawnPoint.x, spawnPoint.y);

            var options = {
                id: player.id, 
                x: spawnPoint.x, 
                y: spawnPoint.y
            };

            nc.trigger(nc.ns.channel.to.client.gameCommand.broadcast, "spawnPlayer", options);
            
            var i = self.spawnTimeouts.indexOf(spawnTimeout);
            self.spawnTimeouts.splice(i, 1);

        }, respawnTime * 1000);

        this.spawnTimeouts.push(spawnTimeout);
    };

    GameController.prototype.updateWorld = function () {
        
        var update = this.getWorldUpdateObject(false);

        if(Object.getOwnPropertyNames(update).length > 0) {
            nc.trigger(nc.ns.channel.to.client.gameCommand.broadcast, "worldUpdate", update);
        }

        this.worldUpdateTimeout = setTimeout(this.updateWorld.bind(this), Settings.NETWORK_UPDATE_INTERVAL);
    };

    GameController.prototype.getWorldUpdateObject = function(getSleeping) {
        getSleeping = getSleeping || false;

        var update = {};

/*
        var body = this.physicsEngine.world.GetBodyList();
        do {
            if((getSleeping || body.IsAwake()) && body.GetType() === Box2D.Dynamics.b2Body.b2_dynamicBody) {
                var userData = body.GetUserData();

                if (userData instanceof GameObject) {
                    var gameObject = userData;
                    var updateData = gameObject.getUpdateData();
                    
                    if (updateData) {
                        update[gameObject.uid] = updateData;
                    }
                }
            }

        } while (body = body.GetNext());
*/

        for (var uid in this.worldUpdateObjects) {

            var gameObject = this.worldUpdateObjects[uid];

            if (!(gameObject instanceof GameObject)) {
                console.warn('Cant find object ' + uid + ' in worldUpdateObjects pool (channel side), here is the object:');
                console.log(gameObject);
                continue;
            }

            var updateData = gameObject.getUpdateData(getSleeping);
                    
            if (updateData) {
                update[gameObject.uid] = updateData;
            }
        }

        return update;
    };

    GameController.prototype.getSpawnedPlayersAndTheirPositions = function() {
        var spawnedPlayers = [];
        for(var id in this.players) {
            var player = this.players[id];
            if(player.isSpawned()) {
                
                var options = {
                    id: id,
                    x: player.getPosition().x * Settings.RATIO,
                    y: player.getPosition().y * Settings.RATIO
                };
                
                if(player.holdingItem) {
                    options.holdingItemUid = player.holdingItem.uid;
                }

                spawnedPlayers.push(options);
            }
        }

        return spawnedPlayers;
    };

    GameController.prototype._getRuntimeItems = function() {

        var runtimeItems = [];
        for (var uid in this.worldUpdateObjects) {
            if(this.worldUpdateObjects[uid] instanceof RubeDoll) {
                var object = this.worldUpdateObjects[uid];
                runtimeItems.push(object);
            }
        }
        return runtimeItems;
    };

    GameController.prototype.gatherRuntimeItemsForWorldUpdate = function() {
        var infos = [];
        var runtimeItems = this._getRuntimeItems();

        // On the other side this is using the level.createItem mechanism to 
        // create the RubeDoll from its ItemSettings
        for (var i = 0; i < runtimeItems.length; i++) {
            var object = runtimeItems[i];
            var options = object.options;
            options.x = object.getPosition().x;
            options.y = object.getPosition().y;
            infos.push({
                uid: object.uid,
                options: object.options
            });
        }

        return infos;
    };

    GameController.prototype.onClientReady = function(userId) {
        var player = this.players[userId];

        var options = {
            spawnedPlayers: this.getSpawnedPlayersAndTheirPositions(),
            worldUpdate: this.getWorldUpdateObject(true),
            runtimeItems: this.gatherRuntimeItemsForWorldUpdate(),
            userId: userId
        };

        nc.trigger(nc.ns.channel.to.client.user.gameCommand.send + userId, "clientReadyResponse", options);

        this.spawnPlayer(player, 0);
    };

    GameController.prototype.endRound = function() {
        this.roundHasEnded = true;

        for(var id in this.players) {
            this.players[id].setInBetweenRounds(true);
        }
    };

    GameController.prototype.isInBetweenRounds = function() {
        return this.roundHasEnded;
    };

    // FIXME: remove this method
    GameController.prototype.onResetLevel = function(userId) {

        console.log('OH NO!!! ON RESET LEVEL IS CALLED AND RESPAWNES PLAYERS');

        Parent.prototype.onResetLevel.call(this);
        nc.trigger(nc.ns.channel.to.client.gameCommand.broadcast, "resetLevel", true);
        for (var key in this.players) {
            this.spawnPlayer(this.players[key]);
        }
    };

    GameController.prototype.destroy = function() {
        clearTimeout(this.animationTimeout);
        clearTimeout(this.worldUpdateTimeout);

        for (var i = 0; i < this.spawnTimeouts.length; i++) {
            clearTimeout(this.spawnTimeouts[i]);
        };

        var runtimeItems = this._getRuntimeItems();
        for (var i = 0; i < runtimeItems.length; i++) {
            runtimeItems[i].destroy();
        }

        Parent.prototype.destroy.call(this);
    };

    return GameController;
});
