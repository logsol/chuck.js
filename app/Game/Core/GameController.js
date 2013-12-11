define([
    "Game/" + GLOBALS.context + "/Physics/Engine",
    "Game/" + GLOBALS.context + "/Loader/Level",
    "Game/" + GLOBALS.context + "/Player"
],

function (Engine, Level, Player) {

    function GameController (physicsEngine) {
        this.players = {};

        if (! physicsEngine instanceof Engine) {
            throw physicsEngine + " is not of type Engine";
        }

        this.physicsEngine = physicsEngine;
    }

    GameController.prototype.getPhysicsEngine = function () {
        return this.physicsEngine;
    }

    GameController.prototype.loadLevel = function (path) {
        if (this.level) {
            this.level.unload();
        }

        this.level = new Level(path, this.physicsEngine);
        this.level.loadLevelInToEngine();
    }

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
