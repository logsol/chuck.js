define([
    "Game/Core/Physics/Engine",
    "Game/Core/Loader/Level"
],

function(Engine, Level) {

    function GameController(physicsEngine) {
        console.log('constructor called');
        this.players = {};

        if (! physicsEngine instanceof Engine) {
            throw physicsEngine + " is not of type Engine";
        }

        this.physicsEngine = physicsEngine;
    }

    GameController.prototype.getPhysicsEngine = function() {
        return this.physicsEngine;
    }

    GameController.prototype.loadLevel = function(path) {
        if (this.level) {
            this.level.unload();
        }

        this.level = new Level(path, this.physicsEngine);
        this.level.loadLevelInToEngine();
    }

    GameController.prototype.destroy = function() {
        for(var player in this.players) {
            this.players[player].destroy();
        }
    }

    GameController.prototype.userJoined = function(user) {
        var player = new Player(id, this.physicsEngine);
        this.players[user.id] = player;
        return player;
    }

    GameController.prototype.userLeft = function(user) {
        var player = this.players[user.id];
        player.destroy();
        delete this.players[user.id];
    }

    return GameController;
});
