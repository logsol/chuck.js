define([
    "Game/Core/GameController",
    "Game/Client/Physics/Engine", 
    "Game/Client/View/ViewController", 
    "Game/Client/Control/PlayerController", 
    "Game/Core/NotificationCenter",
    "Lib/Utilities/RequestAnimFrame"
],

function (Parent, PhysicsEngine, ViewController, PlayerController, NotificationCenter, requestAnimFrame) {

    function GameController () {
        this.viewController = new ViewController();

        Parent.call(this, new PhysicsEngine());

        this.physicsEngine.setCollisionDetector();

        this.me = null;

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
        this.me.setPlayerController(new PlayerController(this.me));
    }

    GameController.prototype.onSpawnPlayer = function(options) {
        var playerId = options.id,
            x = options.x,
            y = options.y;

        var player = this.players[playerId];
        player.spawn(x, y);
    }

    return GameController;
});
