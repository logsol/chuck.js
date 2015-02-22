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
    "Game/Client/AudioPlayer"
],

function (Parent, Box2D, PhysicsEngine, ViewManager, PlayerController, Nc, requestAnimFrame, Settings, GameObject, Doll, DomController, ProtocolHelper, Me, AudioPlayer) {

	"use strict";

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

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
    }

    GameController.prototype.update  = function () {

        Parent.prototype.update.call(this);

        DomController.statsBegin();

        this.animationRequestId = requestAnimFrame(this.update.bind(this));

        this.physicsEngine.update();
        
        if(this.me) {
            this.me.update();
            this.mePositionStateUpdate();
        }

        for (var i = 0; i < this.gameObjects.animated.length; i++) {
            this.gameObjects.animated[i].render();
        }

        this.view.render();

        DomController.statsEnd();
    }

    GameController.prototype.mePositionStateUpdate = function() {   
        if(this.me.isPositionStateUpdateNeeded()) {
            Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "mePositionStateUpdate", this.me.getPositionStateUpdate());
        }
    };

    GameController.prototype.onClientReadyResponse = function(options) {
        
        if (options.worldUpdate) {
            this.onWorldUpdate(options.worldUpdate);
        }

        if (options.runtimeItems) {
            for (var i = 0; i < options.runtimeItems.length; i++) {
                var itemDef = options.runtimeItems[i];

                var alreadyExists = false;
                for (var i = 0; i < this.gameObjects.animated.length; i++) {
                    if(this.gameObjects.animated[i].uid == itemDef.uid) {
                        alreadyExists = true;
                        break;
                    } 
                };

                if(!alreadyExists) {
                    var item = this.level.createItem(itemDef.uid, itemDef.options);
                }
            };
        }

        this.setMe();

        this.clientIsReady = true; // needs to stay before onSpawnPlayer

        if (options.spawnedPlayers) {
            for(var i = 0; i < options.spawnedPlayers.length; i++) {
                this.onSpawnPlayer(options.spawnedPlayers[i]);
            }
        }

        this.audioPlayer = new AudioPlayer(Settings.AUDIO_PATH + "city.mp3");
        this.audioPlayer.play();
    };

    GameController.prototype.onWorldUpdate = function (updateData) {

        var body = this.physicsEngine.world.GetBodyList();
        do {
            var userData = body.GetUserData();
            if (userData instanceof GameObject) {
                var gameObject = userData;
                if(updateData[gameObject.uid]) {
                    var update = updateData[gameObject.uid];

                    if (gameObject instanceof Doll) {
                        if(gameObject === this.me.doll) {
                            this.me.setLastServerPositionState(update);
                            if(!this.me.acceptPositionStateUpdateFromServer()) {
                                continue; // this is to ignore own doll updates from world update 
                            }
                        }
                        gameObject.setActionState(update.as);
                        gameObject.lookAt(update.laxy.x, update.laxy.y);
                    }

                    body.SetAwake(true);
                    body.SetPosition(update.p);
                    body.SetAngle(update.a);
                    body.SetLinearVelocity(update.lv);
                    body.SetAngularVelocity(update.av);
                }
            }
            
        } while (body = body.GetNext());

    }

    GameController.prototype.createMe = function(user) {
        this.me = new Me(user.id, this.physicsEngine, user);
        this.players[user.id] = this.me;
    };

    GameController.prototype.setMe = function() {
        this.me.setPlayerController(new PlayerController(this.me));
        this.view.setMe(this.me);
    }

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
    }

    GameController.prototype.onHandActionResponse = function(options) {
        var player = this.players[options.playerId];

        var item = null;
        for (var i = 0; i < this.gameObjects.animated.length; i++) {
            var currentItem = this.gameObjects.animated[i];
            if(currentItem.uid == options.itemUid) {
                item = currentItem;
                break;
            }
        };

        if(item) {
            if(options.action == "throw") {
                player.throw(options, item);
            } else if(options.action == "grab") {
                player.grab(item);
            }            
        } else {
            console.warn("Item for joint can not be found locally. " + options.itemUid)
        }

    };

    GameController.prototype.onUpdateStats = function(options) {
        var player = this.players[options.playerId];
        player.setStats(options.stats);
    };

    GameController.prototype.onPlayerKill = function(options) {
        var player = this.players[options.playerId];
        var killedByPlayer = this.players[options.killedByPlayerId];
        player.kill(killedByPlayer, options.ragDollId);
    };

    GameController.prototype.onPositionStateReset = function(options) {
        this.me.resetPositionState(options);
    };

    GameController.prototype.onRemoveGameObject = function(options) {
        var object = null;
        for (var i = 0; i < this.gameObjects[options.type].length; i++) {
            if(this.gameObjects[options.type][i].uid == options.uid) {
                object = this.gameObjects[options.type][i];
                break;
            }
        }
        if(object) {
            //this.onGameObjectRemove(options.type, object);
            object.destroy();
        } else {
            console.warn("GameObject for removal can not be found locally. " + options.uid);
        }
    };

    GameController.prototype.loadLevel = function (path) {
        Parent.prototype.loadLevel.call(this, path);
    }

    GameController.prototype.toggleGameStats = function(show) {

        var playersArray = [];
        for (var key in this.players) {
            playersArray.push(this.players[key]);
        };

        var sortedPlayers = playersArray.sort(function(a,b) {
            if(a.stats.score  > b.stats.score)  return -1;
            if(a.stats.score  < b.stats.score)  return 1;
            if(a.stats.deaths < b.stats.deaths) return -1;
            if(a.stats.deaths > b.stats.deaths) return 1;
            if(a.stats.health > b.stats.health) return -1;
            if(a.stats.health < b.stats.health) return 1;
            return 0;
        });

        Nc.trigger(Nc.ns.client.view.gameStats.toggle, show, sortedPlayers);
    };

    GameController.prototype.destroy = function() {

        cancelAnimationFrame(this.animationRequestId);

        Parent.prototype.destroy.call(this);

        this.audioPlayer.destroy();

        this.view.destroy();
    };

    return GameController;
});
