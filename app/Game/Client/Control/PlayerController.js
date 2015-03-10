define([
    "Game/Core/Control/PlayerController", 
    "Lib/Utilities/NotificationCenter",
    "Game/Client/Control/Inputs/KeyboardAndMouse",
    "Game/Client/Control/Inputs/Gamepad",
    "Game/Client/PointerLockManager"
], 

function (Parent, Nc, KeyboardAndMouse, Gamepad, PointerLockManager) {

	"use strict";

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
        if (!PointerLockManager.isLocked()) return;
        Parent.prototype.moveLeft.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'moveLeft');
    }

    PlayerController.prototype.moveRight = function () {
        if (!PointerLockManager.isLocked()) return;
        Parent.prototype.moveRight.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'moveRight');
    }

    PlayerController.prototype.stop = function () {
        Parent.prototype.stop.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'stop');
    }

    PlayerController.prototype.jump = function () {
        if (!PointerLockManager.isLocked()) return;
        Parent.prototype.jump.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'jump');
    }

    PlayerController.prototype.jumpStop = function () {
        if (!PointerLockManager.isLocked()) return;
        Parent.prototype.jumpStop.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'jumpStop');
    }

    PlayerController.prototype.setXY = function(x, y) {
        if (!PointerLockManager.isLocked()) return;
        var options = {x:x, y:y};
        Parent.prototype.lookAt.call(this, options);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'lookAt', options);
    };

    PlayerController.prototype.suicide = function() {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "suicide");
    };

    PlayerController.prototype.handActionRequest = function(options) {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "handActionRequest", options);
    };

    PlayerController.prototype.showInfo = function() {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.game.gameStats.toggle, true);
    };

    PlayerController.prototype.hideInfo = function() {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.game.gameStats.toggle, false);
    };

    PlayerController.prototype.zoomIn = function() {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.game.zoomIn, true);
    };

    PlayerController.prototype.zoomOut = function() {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.game.zoomOut, false);
    };

    PlayerController.prototype.zoomReset = function() {
        if (!PointerLockManager.isLocked()) return;
        Nc.trigger(Nc.ns.client.game.zoomReset, false);
    };
    

    return PlayerController;
});