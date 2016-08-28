define([
    "Game/Core/GameController",
    "Lib/Vendor/Box2D",
    "Game/Client/Physics/Engine", 
    "Game/Client/View/ViewManager", 
    "Game/Client/Control/PlayerController", 
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/RequestAnimFrame",
    "Game/Config/Settings",
    "Game/Client/GameObjects/GameObject",
    "Game/Client/GameObjects/Doll",
    "Game/Client/View/DomController",
    "Lib/Utilities/Protocol/Helper",
    "Game/Client/Me",
    "Game/Client/AudioPlayer",
    "Game/Client/PointerLockManager",
    "Lib/Utilities/Assert",
    "Lib/Utilities/Exception"
],

function (Parent, Box2D, PhysicsEngine, ViewManager, PlayerController, Nc, requestAnimFrame, Settings, GameObject, Doll, DomController, ProtocolHelper, Me, AudioPlayer, PointerLockManager, Assert, Exception) {

	"use strict";

    function GameController (options) {

        this.clientIsReady = false;
        this.view = ViewManager.createView();
        this.me = null;
        this.animationRequestId = null;
        this.audioPlayer = null;

        Parent.call(this, options);

        this.ncTokens = this.ncTokens.concat([
            Nc.on(Nc.ns.client.game.gameStats.toggle, this.toggleGameStats, this)
        ]);
    }

    GameController.prototype = Object.create(Parent.prototype);

    GameController.prototype.getMe = function () {
        return this.me;
    };

    GameController.prototype.update  = function () {

        Parent.prototype.update.call(this);

        this.animationRequestId = requestAnimFrame(this.update.bind(this));
        this.physicsEngine.update();
        
        if(this.me) {
            this.me.update();
            this.mePositionStateOverride();
        }

        //for (var uid in this.gameObjects.animated) {
        //    this.gameObjects.animated[uid].render();
        //}

        Nc.trigger(Nc.ns.client.game.events.render);

        this.view.render();
        DomController.fpsStep();
    };

    GameController.prototype.mePositionStateOverride = function() {   
        if(this.me.isPositionStateOverrideNeeded()) {
            Nc.trigger(
                Nc.ns.client.to.server.gameCommand.send, 
                "mePositionStateOverride", 
                this.me.getPositionStateOverride()
            );
        }
    };

    GameController.prototype.onClientReadyResponse = function(options) {
        var i;

        if (options.worldUpdate) {
            this.onWorldUpdate(options.worldUpdate);
        }

        if (options.runtimeItems) {
            for (i = 0; i < options.runtimeItems.length; i++) {
                
                var itemDef = options.runtimeItems[i];

                if(!this.getItemByUid(itemDef.uid)) {
                    // When creating from synchronization we need to bring it into level format (px)
                    itemDef.options.x *= Settings.RATIO;
                    itemDef.options.y *= Settings.RATIO;
                    this.level.createItem(itemDef.uid, itemDef.options);
                    console.log("Creating runtime Item: ", itemDef.options.name, itemDef.uid)
                }
            }
        }

        this.setMe();

        this.clientIsReady = true; // needs to stay before onSpawnPlayer

        if (options.spawnedPlayers) {
            for(i = 0; i < options.spawnedPlayers.length; i++) {
                this.onSpawnPlayer(options.spawnedPlayers[i]);
            }
        }

        //this.audioPlayer = new AudioPlayer(Settings.AUDIO_PATH + "city.mp3");
        //this.audioPlayer.play();
    };


    /*

    TODO : 
    - remove this 
    - overwrite setUpdateData inside client / Me with an empty function

    GameController.prototype.onWorldUpdateGameObject = function(body, gameObject, update) {
        if(gameObject === this.me.doll) {
            this.me.setLastServerPositionState(update);
            if(!this.me.acceptPositionStateUpdateFromServer()) {
                return; // this is to ignore own doll updates from world update 
            }
        } 

        Parent.prototype.onWorldUpdateGameObject.call(this, body, gameObject, update);
    };
    */

    GameController.prototype.onRemoveGameObject = function(options) {

    };

    GameController.prototype.updateGameObject = function (gameObject, gameObjectUpdate) {
        if(gameObject === this.me.doll) {
            this.me.setLastServerPositionState(gameObjectUpdate);
            if(!this.me.acceptPositionStateUpdateFromServer()) {
                return; // this is to ignore own doll updates from world update 
            }
        } 

        Parent.prototype.updateGameObject.call(this, gameObject, gameObjectUpdate);
    }

    GameController.prototype.createMe = function(user) {
        this.me = new Me(user.id, this.physicsEngine, user);
        this.players[user.id] = this.me;
    };

    GameController.prototype.setMe = function() {
        this.me.setPlayerController(new PlayerController(this.me));
        this.view.setMe(this.me);
    };

    GameController.prototype.onGameCommand = function(message) {
        ProtocolHelper.applyCommand(message, this);
    };

    GameController.prototype.onSpawnPlayer = function(options) {

        if(!this.clientIsReady) {
            return;
        }

        var playerId = options.id,
            x = options.x,
            y = options.y;

        var player = this.players[playerId];
        player.spawn(x, y);
        
        if(options.holdingItemUid) {
            this.onHandActionResponse({
                itemUid: options.holdingItemUid,
                action: "grab",
                playerId: playerId
            });
        }
    };

    GameController.prototype.onHandActionResponse = function(options) {
        var player = this.players[options.playerId];
        var item = this.getItemByUid(options.itemUid);

        if(item) {
            if(options.action == "throw") {
                player.throw(options, item);
            } else if(options.action == "grab") {
                player.grab(item);
            }            
        } else {
            console.warn("Item for joint can not be found locally. " + options.itemUid);
        }

    };

    GameController.prototype.onUpdateStats = function(options) {
        var player = this.players[options.playerId];
        if(!player) {
            throw new Exception("No player with id: " + options.playerId);
        }
        player.setStats(options.stats);

        var playersArray = [];
        for (var key in this.players) {
            playersArray.push(this.players[key]);
        }

        var sortedPlayers = playersArray.sort(function(a,b) {
            if(a.stats.score  > b.stats.score)  return -1;
            if(a.stats.score  < b.stats.score)  return 1;
            if(a.stats.deaths < b.stats.deaths) return -1;
            if(a.stats.deaths > b.stats.deaths) return 1;
            if(a.stats.health > b.stats.health) return -1;
            if(a.stats.health < b.stats.health) return 1;
            return 0;
        });

        Nc.trigger(Nc.ns.client.view.gameStats.update, sortedPlayers);
    };

    GameController.prototype.onPlayerKill = function(options) {
        var player = this.players[options.playerId];
        var killedByPlayer = this.players[options.killedByPlayerId];
        player.kill(killedByPlayer, options.ragDollId);

        Nc.trigger(Nc.ns.client.view.gameStats.kill, {
            victim: {
                name: player.user.options.nickname,
                isMe: player === this.me
            },
            killer: {
                name: killedByPlayer.user.options.nickname,
                isMe: killedByPlayer === this.me
            },
            item: options.item
        });
    };

    GameController.prototype.onPositionStateReset = function(options) {
        this.me.resetPositionState(options);
    };

    GameController.prototype.loadLevel = function (path) {
        Parent.prototype.loadLevel.call(this, path);
    };

    GameController.prototype.onLevelLoaded = function () {
        PointerLockManager.update(null, {start:true});
    };

    GameController.prototype.toggleGameStats = function(show) {
        Nc.trigger(Nc.ns.client.view.gameStats.toggle, show);
    };

    GameController.prototype.beginRound = function() {
        if (this.me.getPlayerController()) {
            this.me.getPlayerController().setIsInBetweenGames(false);
        }
    };

    GameController.prototype.endRound = function() {
        this.me.getPlayerController().setIsInBetweenGames(true);
        this.toggleGameStats(true);
    };

    GameController.prototype.destroy = function() {

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }

        cancelAnimationFrame(this.animationRequestId);

        Parent.prototype.destroy.call(this);

        //this.audioPlayer.destroy();

        this.view.destroy();
    };

    return GameController;
});
