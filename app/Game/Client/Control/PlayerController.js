define([
    "Game/Core/Control/PlayerController", 
    "Lib/Utilities/NotificationCenter",
    "Game/Client/Control/Inputs/KeyboardAndMouse",
    "Game/Client/Control/Inputs/Gamepad",
], 

function (Parent, Nc, KeyboardAndMouse, Gamepad) {

    function PlayerController (me) {

        Parent.call(this, me);

        this.keyboardAndMouse = new KeyboardAndMouse(this);
        this.gamepad = new Gamepad(this);
    }

    PlayerController.prototype = Object.create(Parent.prototype);

    PlayerController.prototype.update = function() {
        Parent.prototype.update.call(this);
        this.gamepad.update();
    };

    PlayerController.prototype.moveLeft = function () {
        Parent.prototype.moveLeft.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'moveLeft');
    }

    PlayerController.prototype.moveRight = function () {
        Parent.prototype.moveRight.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'moveRight');
    }

    PlayerController.prototype.stop = function () {
        Parent.prototype.stop.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'stop');
    }

    PlayerController.prototype.jump = function () {
        Parent.prototype.jump.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'jump');
    }

    PlayerController.prototype.jumpStop = function () {
        Parent.prototype.jumpStop.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'jumpStop');
    }

    PlayerController.prototype.setXY = function(x, y) {
        var options = {x:x, y:y};
        Parent.prototype.lookAt.call(this, options);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'lookAt', options);
    };

    PlayerController.prototype.handActionLeft = function() {
        this.handActionRequest(-0.5, 0.5);
    };

    PlayerController.prototype.handActionRight = function() {
        this.handActionRequest(0.5, 0.5);
    };

    PlayerController.prototype.suicide = function() {
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "suicide");
    };

    PlayerController.prototype.handActionRequest = function(x, y) {
        var options = {x:x, y:y};
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "handActionRequest", options);
    };

    PlayerController.prototype.showInfo = function() {
        Nc.trigger(Nc.ns.client.game.gameStats.toggle, true);
    };

    PlayerController.prototype.hideInfo = function() {
        Nc.trigger(Nc.ns.client.game.gameStats.toggle, false);
    };

    PlayerController.prototype.zoomIn = function() {
        Nc.trigger(Nc.ns.client.game.zoomIn, true);
    };

    PlayerController.prototype.zoomOut = function() {
        Nc.trigger(Nc.ns.client.game.zoomOut, false);
    };

    PlayerController.prototype.zoomReset = function() {
        Nc.trigger(Nc.ns.client.game.zoomReset, false);
    };
    

    return PlayerController;
});