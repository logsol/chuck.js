define([
    "Game/" + GLOBALS.context + "/Physics/Engine",
    "Game/" + GLOBALS.context + "/Loader/TiledLevel",
    "Game/" + GLOBALS.context + "/Player",
    "Lib/Utilities/NotificationCenter"
],

function (PhysicsEngine, TiledLevel, Player, Nc) {

    function GameController (options) {

        this.options = options;
        this.players = {};
        this.level = null;
        this.gameObjects = null;
        this.resetGameObjects();

        this.physicsEngine = new PhysicsEngine();
        this.physicsEngine.setCollisionDetector();

        this.ncTokens = [
            Nc.on(Nc.ns.core.game.gameObject.add, this.onGameObjectAdd, this),
            Nc.on(Nc.ns.core.game.gameObject.remove, this.onGameObjectRemove, this)
        ];

        this.loadLevel(options.levelUid);

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

    /*
    GameController.prototype.userJoined = function (user) {
        this.players[user.id] = this.createPlayer(user);
    }
    */

    GameController.prototype.onUserLeft = function (userId) {
        var player = this.players[userId];
        if(!player) {
            console.warn("User (", userId ,") left who has not joined");
            return;
        }

        var i = this.gameObjects.animated.indexOf(player);
        if(i>=0) this.gameObjects.animated.splice(i, 1);

        player.destroy();
        delete this.players[userId];
    }

    GameController.prototype.createPlayer = function(user) {
        var player = new Player(user.id, this.physicsEngine, user);
        this.players[user.id] = player;
        return player;
    };

    GameController.prototype.destroy = function () {
        for(var player in this.players) {
            // this.players[player].destroy();

            // FIXME: 
            // commented out for now, because players are in gameObjects array.
            // try using a real gameobject for the health bar
        }

        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };

        for (var key in this.gameObjects) {
            for (var i = 0; i < this.gameObjects[key].length; i++) {
                var gameObject = this.gameObjects[key][i];
                this.onGameObjectRemove(key, gameObject);
                gameObject.destroy();
            };
        };

        this.physicsEngine.destroy();
    }

    return GameController;
});
