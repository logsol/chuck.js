define([
    "Game/" + GLOBALS.context + "/Physics/Engine",
    "Game/" + GLOBALS.context + "/Loader/TiledLevel",
    "Game/" + GLOBALS.context + "/Player",
    "Lib/Utilities/NotificationCenter"
],

function (PhysicsEngine, TiledLevel, Player, NotificationCenter) {

    function GameController () {
        this.players = {};
        this.level = null;
        this.gameObjects = {
            animated: [],
            fixed: []
        };

        this.physicsEngine = new PhysicsEngine();
        this.physicsEngine.setCollisionDetector();

        NotificationCenter.on("game/level/loaded", this.onLevelLoaded, this);
    }

    GameController.prototype.update = function() {
        
    };

    GameController.prototype.getPhysicsEngine = function () {
        return this.physicsEngine;
    }

    GameController.prototype.loadLevel = function (levelUid) {

        if (this.level) {
            this.level.destroy();
            this.gameObjects = {
                animated: [],
                fixed: []
            };
        }

        this.level = new TiledLevel(levelUid, this.physicsEngine, this.gameObjects);
    }

    GameController.prototype.onResetLevel = function() {
        this.loadLevel(this.level.uid);
    };

    GameController.prototype.onLevelLoaded = function() {
        this.update();
    };


    GameController.prototype.destroy = function () {
        for(var player in this.players) {
            this.players[player].destroy();
        }
    }

    GameController.prototype.userJoined = function (user) {
        this.players[user.id] = this.createPlayer(user);
    }

    GameController.prototype.userLeft = function (user) {
        var player = this.players[user.id];
        player.destroy();
        delete this.players[user.id];
    }

    GameController.prototype.createPlayer = function(user) {
        return new Player(user.id, this.physicsEngine);
    };

    return GameController;
});
