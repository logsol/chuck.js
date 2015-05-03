define([
    "Game/" + GLOBALS.context + "/Physics/Engine",
    "Game/" + GLOBALS.context + "/Loader/TiledLevel",
    "Game/" + GLOBALS.context + "/Player",
    "Lib/Utilities/NotificationCenter",
    "Game/" + GLOBALS.context + "/GameObjects/Doll",
    "Game/" + GLOBALS.context + "/GameObjects/GameObject",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Utilities/Assert",
],

function (PhysicsEngine, TiledLevel, Player, Nc, Doll, GameObject, Item, Assert) {

	"use strict";

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
    };

    GameController.prototype.loadLevel = function (levelUid) {

        if (this.level) {
            this.level.destroy();
            this.resetGameObjects();
        }

        this.level = new TiledLevel(levelUid, this.physicsEngine, this.gameObjects);
    };

    GameController.prototype.onWorldUpdate = function (updateData) {

        var body = this.physicsEngine.world.GetBodyList();
        do {
            var userData = body.GetUserData();
            if (userData instanceof GameObject) {
                var gameObject = userData;
                if(updateData[gameObject.uid]) {
                    var update = updateData[gameObject.uid];
                    this.onWorldUpdateGameObject(body, gameObject, update);
                }
            }

        } while (body = body.GetNext());

    };

    GameController.prototype.onWorldUpdateGameObject = function(body, gameObject, update) {
        if (gameObject instanceof Doll) {
            /*
            if(gameObject === this.me.doll) {
                this.me.setLastServerPositionState(update);
                if(!this.me.acceptPositionStateUpdateFromServer()) {
                    return; // this is to ignore own doll updates from world update 
                }
            }
            */
            gameObject.setActionState(update.as);
            gameObject.lookAt(update.laxy.x, update.laxy.y);
        }

        Assert.number(update.p.x, update.p.y);
        Assert.number(update.a);
        Assert.number(update.lv.x, update.lv.y);
        Assert.number(update.av);

        body.SetAwake(true);
        body.SetPosition(update.p);
        body.SetAngle(update.a);
        body.SetLinearVelocity(update.lv);
        body.SetAngularVelocity(update.av);
    };

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

        this.clearItemsOfPlayerFingerPrints(player);
        
        player.destroy();
        delete this.players[userId];
    };

    GameController.prototype.createPlayer = function(user) {
        var player = new Player(user.id, this.physicsEngine, user);
        this.players[user.id] = player;
        return player;
    };

    GameController.prototype.clearItemsOfPlayerFingerPrints = function(player) {
        for (var key in this.gameObjects) {
            for (var i = 0; i < this.gameObjects[key].length; i++) { // to go through animated and fixed.
                var gameObject = this.gameObjects[key][i];
                if (gameObject instanceof Item) {

                    if (gameObject.getLastMovedBy() && gameObject.getLastMovedBy().player === player) {
                        gameObject.setLastMovedBy(null);
                    }
                }
            }
        }
    };

    GameController.prototype.destroy = function () {
        var i = 0;

        /*
        for(var player in this.players) {
            // this.players[player].destroy();

            // FIXME: 
            // commented out for now, because players are in gameObjects array.
            // try using a real gameobject for the health bar
        }*/

        for (i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        }

        /*
         *   Contents of gameObject: Players, Items, Tiles, RagDolls
         *   No Dolls.
         */

        for (var key in this.gameObjects) {
            for (i = 0; i < this.gameObjects[key].length; i++) {
                var gameObject = this.gameObjects[key][i];

                gameObject.destroy();
            }
        }

        this.gameObjects = {
            fixed: [],
            animated: []
        };

        this.physicsEngine.destroy();
    };

    return GameController;
});
