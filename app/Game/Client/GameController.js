define([
    "Game/Core/GameController",
    "Lib/Vendor/Box2D",
    "Game/Client/Physics/Engine", 
    "Game/Client/View/ViewManager", 
    "Game/Client/Control/PlayerController", 
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/RequestAnimFrame",
    "Game/Config/Settings",
    "Lib/Vendor/Stats",
    "Game/Client/GameObjects/GameObject",
    "Game/Client/GameObjects/Doll"
],

function (Parent, Box2D, PhysicsEngine, ViewManager, PlayerController, NotificationCenter, requestAnimFrame, Settings, Stats, GameObject, Doll) {

    function GameController () {
        this.view = ViewManager.createView();
        
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

        for (var i = 0; i < this.gameObjects.animated.length; i++) {
            this.gameObjects.animated[i].render();
        }

        this.view.render();

        this.stats.end();
    }

    GameController.prototype.onWorldUpdate = function (updateData) {

        var body = this.physicsEngine.world.GetBodyList();
        do {
            var userData = body.GetUserData();
            if (userData instanceof GameObject) {
                var gameObject = userData;
                if(updateData[gameObject.uid]) {
                    var update = updateData[gameObject.uid];
                    body.SetAwake(true);  
                    body.SetPosition(update.p);
                    body.SetAngle(update.a);
                    body.SetLinearVelocity(update.lv);
                    body.SetAngularVelocity(update.av);

                    if (gameObject instanceof Doll) {
                        gameObject.setActionState(update.as);
                        gameObject.lookAt(update.laxy.x, update.laxy.y);
                    }
                }
            }
        } while (body = body.GetNext());

    }

    GameController.prototype.onJoinMe = function (playerId) {
        this.me = this.players[playerId];
        this.me.setPlayerController(new PlayerController(this.me));
        this.view.setMe(this.me);
    }

    GameController.prototype.onSpawnPlayer = function(options) {
        var playerId = options.id,
            x = options.x,
            y = options.y;

        var player = this.players[playerId];
        player.spawn(x, y);
        this.gameObjects.animated.push(player.getDoll());
    }

    GameController.prototype.loadLevel = function (path) {
        Parent.prototype.loadLevel.call(this, path);
    }

    GameController.prototype.userLeft = function(user) {
        var doll = this.players[user.id].doll;
        var i = this.gameObjects.animated.indexOf(doll);
        if(i>=0) this.gameObjects.animated.splice(i, 1);

        Parent.prototype.userLeft.call(this, user);
    }

    return GameController;
});
