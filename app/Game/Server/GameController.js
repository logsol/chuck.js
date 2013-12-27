define([
    "Game/Core/GameController",
    "Game/Server/Physics/Engine",
    "Game/Config/Settings", 
    "Game/Server/Control/PlayerController",
    "Lib/Utilities/RequestAnimFrame",
    "Lib/Utilities/NotificationCenter",
    "Game/Server/Player",
    "Game/Server/GameObjects/GameObject",
    "Game/Server/GameObjects/Doll"
],

function (Parent, PhysicsEngine, Settings, PlayerController, requestAnimFrame, NotificationCenter, Player, GameObject, Doll) {

    function GameController (channel) {
        Parent.call(this, new PhysicsEngine());

        this.physicsEngine.setCollisionDetector();

        this.channel = channel;

        this.update();
        this.updateWorld();

        NotificationCenter.on('user/joined', this.userJoined, this);
        NotificationCenter.on('user/left', this.userLeft, this);

        console.checkpoint('starting game controller for channel ' + channel.name);
    }

    GameController.prototype = Object.create(Parent.prototype);

    GameController.prototype.update  = function () {

        requestAnimFrame(this.update.bind(this));

        this.physicsEngine.update();
        for(var id in this.players) {
            this.players[id].update();
        }
    }

    GameController.prototype.userJoined = function (user) {
        Parent.prototype.userJoined.call(this, user);
        var player = this.players[user.id];
        user.setPlayer(player);
        this.spawnPlayer(player);
    }

    GameController.prototype.spawnPlayer = function(player) {
        var x = 150,
            y = 50;
        player.spawn(x, y);

        var message = {
            spawnPlayer: {
                id: player.id, 
                x: x, 
                y: y
            }
        };
        NotificationCenter.trigger("sendControlCommandToAllUsers", "gameCommand", message);
    };

    GameController.prototype.createPlayer = function(user) {
        var player = new Player(user.id, this.physicsEngine);
        player.setPlayerController(new PlayerController(player))
        
        return player;
    };

    GameController.prototype.updateWorld = function () {
        
        var update = this.getWorldUpdateObject(false);

        if(Object.getOwnPropertyNames(update).length > 0) {
            NotificationCenter.trigger("sendControlCommandToAllUsers", 'gameCommand', {worldUpdate:update});
        }

        setTimeout(this.updateWorld.bind(this), Settings.WORLD_UPDATE_BROADCAST_INTERVAL);
    }

    GameController.prototype.getWorldUpdateObject = function(getSleeping) {
        getSleeping = getSleeping || false;

        var update = {};

        var body = this.physicsEngine.world.GetBodyList();
        do {
            if(getSleeping || body.IsAwake()) {
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
        for(id in this.players) {
            var player = this.players[id];
            if(player.isSpawned) {
                spawnedPlayers.push({
                    id: id,
                    x: player.getPosition().x * Settings.RATIO,
                    y: player.getPosition().y * Settings.RATIO
                });
            }
        }

        return spawnedPlayers;
    };


    return GameController;
});
