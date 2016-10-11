define([
    "Game/" + App.context + "/Physics/Engine",
    "Game/" + App.context + "/Loader/TiledLevel",
    "Game/" + App.context + "/Player",
    "Lib/Utilities/NotificationCenter",
    "Game/" + App.context + "/GameObjects/Doll",
    "Game/" + App.context + "/GameObjects/GameObject",
    "Game/" + App.context + "/GameObjects/Item",
    "Lib/Utilities/Assert",
],

function (PhysicsEngine, TiledLevel, Player, nc, Doll, GameObject, Item, Assert) {

	"use strict";

    function GameController (options) {

        this.options = options;
        this.players = {};
        this.level = null;
        this.worldUpdateObjects = {};

        this.physicsEngine = new PhysicsEngine();
        this.physicsEngine.setCollisionDetector();

        this.ncTokens = [
            nc.on(nc.ns.core.game.worldUpdateObjects.add, this.onWorldUpdateObjectAdd, this),
            nc.on(nc.ns.core.game.worldUpdateObjects.remove, this.onWorldUpdateObjectRemove, this)
        ];

        this.loadLevel(options.levelUid);

        this.update();
    }

    GameController.prototype.update = function() {
        // extend for both sides if necessary
    };

    GameController.prototype.onWorldUpdateObjectAdd = function(object) {
        this.worldUpdateObjects[object.uid] = object;
    };

    GameController.prototype.onWorldUpdateObjectRemove = function(object) {
        delete this.worldUpdateObjects[object.uid];
    };

    GameController.prototype.getPhysicsEngine = function () {
        return this.physicsEngine;
    };

    GameController.prototype.getItemByUid = function(uid) {
        // FIXME : maybe divide this into a dedicated item pool?
        return this.worldUpdateObjects[uid];
    };

    GameController.prototype.loadLevel = function (levelUid) {

        if (this.level) {
            this.level.destroy();
            this.worldUpdateObjects = {};
        }

        this.level = new TiledLevel(levelUid, this.physicsEngine);
    };

    /*
     *  This is now in core, because the recorder/player 
     *  uses the world update mechanism on the channel side
     */ 
    GameController.prototype.onWorldUpdate = function (updateData) {

        for (var uid in updateData) {

            var gameObject = this.worldUpdateObjects[uid];

            if (!(gameObject instanceof GameObject)) {
                console.warn('Can\'t find object ' + uid + ' in worldUpdateObjects pool:', Object.keys(this.worldUpdateObjects));
                continue;
            }

            this.updateGameObject(gameObject, updateData[uid]);
        }
    };


    GameController.prototype.updateGameObject = function(gameObject, gameObjectUpdate) {
        gameObject.setUpdateData(gameObjectUpdate);
    }

    GameController.prototype.onResetLevel = function() {
        this.loadLevel(this.level.uid);
    };

    GameController.prototype.onUserLeft = function (userId) {
        var player = this.players[userId];
        if(!player) {
            console.warn("User (", userId ,") left who has not joined");
            return;
        }
        
        player.destroy();
        delete this.players[userId];
    };

    GameController.prototype.createPlayer = function(user, revealedGameController) {
        var player = new Player(user.id, this.physicsEngine, user, revealedGameController);
        this.players[user.id] = player;
        return player;
    };


    GameController.prototype.destroy = function () {
        for(var player in this.players) {
            this.players[player].destroy();
        }

        // FIXME ns.client in core?
        nc.trigger(nc.ns.client.game.events.destroy);

        // Testing after destroy if worldUpdateObjects is empty
        // events.game.destroy -> gameobjects.destroy() -> nc.trigger(worldUpdateObjects.remove)
        if(Object.keys(this.worldUpdateObjects).length > 0) {
            console.warn('Not all worldUpdateObjects have been removed... ', Object.keys(this.worldUpdateObjects));
        }

        this.physicsEngine.destroy();
        this.worldUpdateObjects = null;

        nc.off(this.ncTokens);
    };

    return GameController;
});
