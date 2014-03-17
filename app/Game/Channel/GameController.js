define([
    "Game/Core/GameController",
    "Game/Channel/Physics/Engine",
    "Game/Config/Settings", 
    "Game/Channel/Control/PlayerController",
    "Lib/Utilities/RequestAnimFrame",
    "Lib/Utilities/NotificationCenter",
    "Lib/Vendor/Box2D",
    "Game/Channel/Player",
    "Game/Channel/GameObjects/GameObject",
    "Game/Channel/GameObjects/Doll",
    "Game/Channel/GameObjects/Items/RagDoll"
],

function (Parent, PhysicsEngine, Settings, PlayerController, requestAnimFrame, Nc, Box2D, Player, GameObject, Doll, RagDoll) {

    function GameController (channel) {
        
        this.channel = channel;

        Parent.call(this);

        Nc.on(Nc.ns.channel.events.user.joined, this.onUserJoined, this);
        Nc.on(Nc.ns.channel.events.user.left, this.onUserLeft, this);
        Nc.on('user/resetLevel', this.onResetLevel, this);
        Nc.on('user/clientReady', this.onClientReady, this);
        Nc.on('player/killed', this.onPlayerKilled, this);

        console.checkpoint('starting game controller for channel ' + channel.name);
        
        var nextUid = this.getNextLevelUid();
        this.loadLevel(nextUid);
    }

    GameController.prototype = Object.create(Parent.prototype);

    GameController.prototype.update  = function () {

        Parent.prototype.update.call(this);

        requestAnimFrame(this.update.bind(this));

        this.physicsEngine.update();
        for(var id in this.players) {
            this.players[id].update();
        }
    }

    GameController.prototype.onLevelLoaded = function() {
        Parent.prototype.onLevelLoaded.call(this);
        this.updateWorld();
    };

    GameController.prototype.onUserJoined = function (user) {
        this.createPlayer(user);
    }

    GameController.prototype.createPlayer = function(user) {
        var player = Parent.prototype.createPlayer.call(this, user);
        player.setPlayerController(new PlayerController(player))
        user.setPlayer(player);
    };

    GameController.prototype.onPlayerKilled = function(player, respawnTime) {
        this.spawnPlayer(player, respawnTime);
    };

    GameController.prototype.spawnPlayer = function(player, respawnTime) {
        var self = this;
        var spawnPoint = this.level.getRandomSpawnPoint();

        respawnTime = typeof respawnTime == 'undefined' 
            ? Settings.RESPAWN_TIME
            : respawnTime;

        setTimeout(function() {
            player.spawn(spawnPoint.x, spawnPoint.y);
            // put it into 
            self.gameObjects.animated.push(player);

            var options = {
                id: player.id, 
                x: spawnPoint.x, 
                y: spawnPoint.y
            };

            Nc.trigger("broadcastGameCommand", "spawnPlayer", options);
        }, respawnTime * 1000);
    };

    GameController.prototype.updateWorld = function () {
        
        var update = this.getWorldUpdateObject(false);

        if(Object.getOwnPropertyNames(update).length > 0) {
            Nc.trigger("broadcastGameCommand", 'worldUpdate', update);
        }

        setTimeout(this.updateWorld.bind(this), Settings.WORLD_UPDATE_BROADCAST_INTERVAL);
    }

    GameController.prototype.getWorldUpdateObject = function(getSleeping) {
        getSleeping = getSleeping || false;

        var update = {};

        var body = this.physicsEngine.world.GetBodyList();
        do {
            if((getSleeping || body.IsAwake()) && body.GetType() === Box2D.Dynamics.b2Body.b2_dynamicBody) {
                var userData = body.GetUserData();

                if (userData instanceof GameObject) {
                    var gameObject = userData;

                    update[gameObject.uid] = {
                        p: body.GetPosition(),
                        a: body.GetAngle(),
                        lv: body.GetLinearVelocity(),
                        av: body.GetAngularVelocity()
                    };

                    if(gameObject instanceof Doll) {
                        update[gameObject.uid].as = gameObject.getActionState();
                        update[gameObject.uid].laxy = gameObject.lookAtXY;
                    }
                }
            }

        } while (body = body.GetNext());

        return update;
    };

    GameController.prototype.getSpawnedPlayersAndTheirPositions = function() {
        var spawnedPlayers = [];
        for(var id in this.players) {
            var player = this.players[id];
            if(player.isSpawned) {
                
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

    GameController.prototype.getRuntimeItems = function() {
        var objects = []

        for (var i = 0; i < this.gameObjects.animated.length; i++) {
            if(this.gameObjects.animated[i] instanceof RagDoll) {
                var object = this.gameObjects.animated[i];
                var options = object.options;
                options.x = object.getPosition().x;
                options.y = object.getPosition().y;
                objects.push({
                    uid: object.uid,
                    options: object.options
                });
            }
        };

        return objects;
    };

    GameController.prototype.onClientReady = function(userId) {
        var player = this.players[userId];
        this.spawnPlayer(player, 0);

        var options = {
            spawnedPlayers: this.getSpawnedPlayersAndTheirPositions(),
            worldUpdate: this.getWorldUpdateObject(true),
            runtimeItems: this.getRuntimeItems(),
            userId: userId
        }

        Nc.trigger('user/' + userId + "/gameCommand", "clientReadyResponse", options);
    };

    GameController.prototype.onResetLevel = function(userId) {
        Parent.prototype.onResetLevel.call(this);
        Nc.trigger("broadcastGameCommand", "resetLevel", true);
        for (var key in this.players) {
            this.spawnPlayer(this.players[key]);
        }
    };

    GameController.prototype.getNextLevelUid = function() {
        if(!this.level) return this.channel.options.levelUids[0];

        var levelCount = this.channel.options.levelUids.length;

        for (var i = 0; i < levelCount; i++) {
            var uid = this.channel.options.levelUids[i];
            if(uid == this.level.uid) {
                break;
            }
        };

        var next = i + 1;

        return this.channel.options.levelUids[next % levelCount];
    };


    return GameController;
});
