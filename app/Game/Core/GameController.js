define([
    "Game/" + GLOBALS.context + "/Physics/Engine",
    "Game/" + GLOBALS.context + "/Loader/Level",
    "Game/" + GLOBALS.context + "/Player"
],

function (PhysicsEngine, Level, Player) {

    function GameController () {
        this.players = {};
        this.gameObjects = {
            animated: [],
            fixed: []
        };

        this.physicsEngine = new PhysicsEngine();
        this.physicsEngine.setCollisionDetector();

        this.update();
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

        this.level = new Level(levelUid, this.physicsEngine, this.gameObjects);
    }

    GameController.prototype.onResetLevel = function() {
        this.loadLevel(this.level.uid);
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
