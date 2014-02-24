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
        this.gameObjects = null;
        this.resetGameObjects();

        this.physicsEngine = new PhysicsEngine();
        this.physicsEngine.setCollisionDetector();

        NotificationCenter.on("game/level/loaded", this.onLevelLoaded, this);

        NotificationCenter.on("game/object/add", this.onGameObjectAdd, this);
        NotificationCenter.on("game/object/remove", this.onGameObjectRemove, this);

        this.update();
    }

    GameController.prototype.update = function() {
        // extend for both sides if necessary
    };

    GameController.prototype.resetGameObjects = function() {
        this.gameObjects = {
            fixed: [],
            animated: []
        };
    };

    GameController.prototype.onGameObjectAdd = function(type, object) {
        this.gameObjects[type].push(object);
    };

    GameController.prototype.onGameObjectRemove = function(type, object) {
        var i = this.gameObjects[type].indexOf(object);
        if(i>=0) this.gameObjects[type].splice(i, 1);
    };

    GameController.prototype.getPhysicsEngine = function () {
        return this.physicsEngine;
    }

    GameController.prototype.loadLevel = function (levelUid) {

        if (this.level) {
            this.level.destroy();
            this.resetGameObjects();
        }

        this.level = new TiledLevel(levelUid, this.physicsEngine, this.gameObjects);
    }

    GameController.prototype.onResetLevel = function() {
        this.loadLevel(this.level.uid);
    };

    GameController.prototype.onLevelLoaded = function() {
        
    };


    GameController.prototype.destroy = function () {
        for(var player in this.players) {
            this.players[player].destroy();
        }
    }

    /*
    GameController.prototype.userJoined = function (user) {
        this.players[user.id] = this.createPlayer(user);
    }
    */

    GameController.prototype.onUserLeft = function (user) {
        var player = this.players[user.id];

        var i = this.gameObjects.animated.indexOf(player);
        if(i>=0) this.gameObjects.animated.splice(i, 1);

        player.destroy();
        delete this.players[user.id];
    }

    GameController.prototype.createPlayer = function(user) {
        var player = new Player(user.id, this.physicsEngine);
        this.players[user.id] = player;
        return player;
    };

    return GameController;
});
