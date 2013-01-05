define([
    "Game/Core/GameController",
    "Game/Client/Physics/Engine", 
    "Game/Client/View/ViewController", 
    "Game/Client/Control/KeyboardController", 
    "Game/Core/NotificationCenter",
    "Lib/Utilities/RequestAnimFrame"
],

function (Parent, PhysicsEngine, ViewController, KeyboardController, NotificationCenter, requestAnimFrame) {

    function GameController () {
        this.viewController = new ViewController();

        Parent.call(this, new PhysicsEngine());

        this.me = null;
        this.keyboardController = null;

        this.update();
    }

    GameController.prototype = Object.create(Parent.prototype);

    GameController.prototype.destruct = function() {
        //destroy box2d world etc.
    };

    GameController.prototype.getMe = function () {
        return this.me;
    }

    GameController.prototype.update  = function () {

        requestAnimFrame(this.update.bind(this));

        this.physicsEngine.update();
        this.viewController.update();

        if(this.me) {
            this.keyboardController.update();    
            this.me.update();
        }
    }

    GameController.prototype.onWorldUpdate = function (updateData) {

        var body = this.physicsEngine.world.GetBodyList();
        do {
            var bodyName = body.GetUserData();
            if(bodyName && updateData[bodyName]) {        
                var update = updateData[bodyName];             
                body.SetAwake(true);            
                body.SetPosition(update.p);
                body.SetAngle(update.a);
                body.SetLinearVelocity(update.lv);
                body.SetAngularVelocity(update.av);
            }
        } while (body = body.GetNext());

    }


    GameController.prototype.onJoinMe = function (playerId) {
        //this.onSpawnPlayer(options);
        this.me = this.players[playerId];
        this.keyboardController = new KeyboardController(this.me, this);
    }

    GameController.prototype.onSpawnPlayer = function(options) {
        var playerId = options.id,
            x = options.x,
            y = options.y;

        var player = this.players[playerId];
        player.spawn(x, y);


    };

    return GameController;
});
