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

    GameController.prototype.meJoined = function (user) {
        this.me = this.userJoined(user);
        this.keyboardController = new KeyboardController(this.me, this);
    }

    GameController.prototype.processGameCommand = function (command, options) {
        
        if (command == "worldUpdate") {

            var body = this.physicsEngine.world.GetBodyList();
            do {
                var userData = body.GetUserData();
                if(userData && options[userData]) {        
                    var update = options[userData];
                                
                    //console.log('position difference:', (body.GetPosition().y - update.p.y) * 30, body.GetLinearVelocity().y);
                    
                    body.SetAwake(true);            
                    body.SetPosition(update.p);
                    body.SetAngle(update.a);
                    body.SetLinearVelocity(update.lv);
                    body.SetAngularVelocity(update.av);
                }
            } while (body = body.GetNext());

        }

    }

    return GameController;
});
