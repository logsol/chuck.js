define([
    "Game/Core/GameController",
    "Lib/Vendor/Box2D",
    "Game/Client/Physics/Engine", 
    "Game/Client/View/ViewController", 
    "Game/Client/Control/PlayerController", 
    "Game/Core/NotificationCenter",
    "Lib/Utilities/RequestAnimFrame",
    "Game/Config/Settings",
    "Lib/Vendor/Stats"
],

function (Parent, Box2D, PhysicsEngine, ViewController, PlayerController, NotificationCenter, requestAnimFrame, Settings, Stats) {

    function GameController () {
        this.viewController = new ViewController();

        Parent.call(this, new PhysicsEngine());

        this.physicsEngine.setCollisionDetector();

        this.me = null;

        this.initStats();

        this.update();
    }

    GameController.prototype = Object.create(Parent.prototype);

    GameController.prototype.initStats = function() {
        this.stats = new Stats();
        this.stats.setMode(0);
        document.body.appendChild(this.stats.domElement);
    };

    GameController.prototype.makeMouseJoint = function(p) {
        var ground = this.physicsEngine.getGround();
        var body = this.me.getBody();

        var def = new Box2D.Dynamics.Joints.b2MouseJointDef();
 
        def.bodyA = ground;
        def.bodyB = body;
        def.target = p;
         
        def.collideConnected = false;
        def.maxForce = 100;
        def.dampingRatio = 0.99;
         
        this.mouse_joint = this.physicsEngine.world.CreateJoint(def);
         
        body.SetAwake(true);
    }

    GameController.prototype.destruct = function() {
        //destroy box2d world etc.
    };

    GameController.prototype.getMe = function () {
        return this.me;
    }

    GameController.prototype.update  = function () {
        this.stats.begin();

        requestAnimFrame(this.update.bind(this));

        this.physicsEngine.update();
        
        if(this.me) {
            this.me.update();
        }

        this.viewController.render();

        this.stats.end();
    }

    GameController.prototype.onWorldUpdate = function (updateData) {

        var body = this.physicsEngine.world.GetBodyList();
        do {
            var bodyName = body.GetUserData();
            if(bodyName && updateData[bodyName]) {
                var update = updateData[bodyName];             
                body.SetAwake(true);  

                if(false && this.me && this.me.getBody() == body) {

                    var p = body.GetPosition();
                    var x = update.p.x - p.x;
                    var y = update.p.y - p.y;

                    var max = 0.5;
                    var factor = 0.2;

                    //if(x > max || x < -max || y > max || y < -max) {
                        if(!this.mouse_joint) this.makeMouseJoint(update.p);
                        else this.mouse_joint.SetTarget(update.p);
                        var self = this;
                        /*setTimeout(function() {
                            self.physicsEngine.world.DestroyJoint(self.mouse_joint);
                            self.mouse_joint = null;
                        }, Settings.WORLD_UPDATE_BROADCAST_INTERVAL / 2)*/
                    //} else {
                        //this.physicsEngine.world.DestroyJoint(this.mouse_joint);
                        //this.mouse_joint = null;
                    //}

                    // NEXT TIME, try to create a simple body, that gets position and velocities from server doll
                    // and connect the joint to that.

                } else {
                    body.SetPosition(update.p);
                    body.SetAngle(update.a);
                    body.SetLinearVelocity(update.lv);
                    body.SetAngularVelocity(update.av);                
                }
            }
        } while (body = body.GetNext());

    }

    GameController.prototype.onJoinMe = function (playerId) {
        //this.onSpawnPlayer(options);
        this.me = this.players[playerId];
        this.me.setPlayerController(new PlayerController(this.me));
        this.viewController.setMe(this.me);
    }

    GameController.prototype.onSpawnPlayer = function(options) {
        var playerId = options.id,
            x = options.x,
            y = options.y;

        var player = this.players[playerId];
        player.spawn(x, y);

        // add to view controller
        this.viewController.addPlayer(player);
    }

    GameController.prototype.loadLevel = function (path) {
        Parent.prototype.loadLevel.call(this, path);
        var tiles = this.level.levelObject.tiles;
        this.viewController.loadMeshes(tiles);
    }

    return GameController;
});
