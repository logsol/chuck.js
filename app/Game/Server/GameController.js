define([
    "Game/Core/GameController",
    "Game/Core/Physics/Engine", 
    "Game/Config/Settings", 
    "Game/Server/Control/InputController",
    "Lib/Utilities/RequestAnimFrame",
    "Game/Core/NotificationCenter"
],

function (Parent, PhysicsEngine, Settings, InputController, requestAnimFrame, NotificationCenter) {

    function GameController (channel) {
        Parent.call(this, new PhysicsEngine());

        this.inputControllers = {};
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
        
        var id = user.id;
        var player = this.players[id];
        user.setPlayer(player);
        player.spawn(50, 50);
        this.inputControllers[id] = new InputController(player);
        player.inputController = this.inputControllers[id]; // FIXME move this to Server/Player
    }

    GameController.prototype.userLeft = function (user) {
        Parent.prototype.userLeft.call(this, user);
        delete this.inputControllers[user.id];
    }

    GameController.prototype.progressGameCommandFromUser = function (command, options, user) {
        var inputController = this.inputControllers[user.id];
        if (typeof inputController[command] == 'function') {
            inputController[command](options);
        }
    }

    GameController.prototype.updateWorld = function () {
        
        var update = {};
        var isUpdateNeeded = false;

        var body = this.physicsEngine.world.GetBodyList();
        do {
            var userData = body.GetUserData();

            if(userData && body.IsAwake()) {
                update[userData] = {
                    p: body.GetPosition(),
                    a: body.GetAngle(),
                    lv: body.GetLinearVelocity(),
                    av: body.GetAngularVelocity()
                };
                isUpdateNeeded = true;
            }
        } while (body = body.GetNext());
        
        if(isUpdateNeeded) {
            NotificationCenter.trigger("sendControlCommandToAllUsers", 'gameCommand', {worldUpdate:update});
        }

        setTimeout(this.updateWorld.bind(this), Settings.WORLD_UPDATE_BROADCAST_INTERVAL);
    }

    return GameController;
});
