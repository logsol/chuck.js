define([
    "Game/Core/Control/PlayerController", 
    "Lib/Utilities/NotificationCenter",
    "Game/Client/Control/Inputs/KeyboardAndMouse",
    "Game/Client/Control/Inputs/Gamepad",
    "Game/Client/PointerLockManager"
], 

function (Parent, nc, KeyboardAndMouse, Gamepad, pointerLockManager) {

	"use strict";

    function PlayerController (me) {

        Parent.call(this, me);

        this._inputSeq = 0;
        this.keyboardAndMouse = new KeyboardAndMouse(this);
        this.gamepad = new Gamepad(this);
    }

    PlayerController.prototype = Object.create(Parent.prototype);

    PlayerController.prototype.update = function() {

        Parent.prototype.update.call(this);
        this.gamepad.update();
    };

    PlayerController.prototype._recordAndSend = function(command) {
        this._inputSeq++;
        if (this.player.doll && this.player.doll.body) {
            var vel = this.player.doll.body.GetLinearVelocity();
            this.player.inputBuffer.add({
                seq: this._inputSeq,
                timestamp: Date.now(),
                vx: vel.x,
                vy: vel.y
            });
        }
        nc.trigger(nc.ns.client.to.server.gameCommand.send, command, {_seq: this._inputSeq});
    };

    PlayerController.prototype.moveLeft = function () {
        if (!this.isPlayerInputAllowed()) return;
        Parent.prototype.moveLeft.call(this);
        this._recordAndSend('moveLeft');
    }

    PlayerController.prototype.moveRight = function () {
        if (!this.isPlayerInputAllowed()) return;
        Parent.prototype.moveRight.call(this);
        this._recordAndSend('moveRight');
    }

    // always allow to stop, to prevent endless running
    PlayerController.prototype.stop = function () {
        Parent.prototype.stop.call(this);
        this._recordAndSend('stop');
    }

    PlayerController.prototype.jump = function () {
        if (!this.isPlayerInputAllowed()) return;
        Parent.prototype.jump.call(this);
        this._recordAndSend('jump');
    }

    // always allow to stop.
    PlayerController.prototype.jumpStop = function () {
        Parent.prototype.jumpStop.call(this);
        this._recordAndSend('jumpStop');
    }

    PlayerController.prototype.setXY = function(x, y) {
        if (!this.isPlayerInputAllowed()) return;
        var options = {x:x, y:y};
        Parent.prototype.lookAt.call(this, options);
        nc.trigger(nc.ns.client.to.server.gameCommand.send, 'lookAt', options);
    };

    PlayerController.prototype.suicide = function() {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.to.server.gameCommand.send, "suicide");
    };

    PlayerController.prototype.handActionRequest = function(options) {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.to.server.gameCommand.send, "handActionRequest", options);
    };

    PlayerController.prototype.showInfo = function() {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.game.gameStats.toggle, true);
    };

    PlayerController.prototype.hideInfo = function() {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.game.gameStats.toggle, false);
    };

    PlayerController.prototype.zoomIn = function() {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.game.zoomIn, true);
    };

    PlayerController.prototype.zoomOut = function() {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.game.zoomOut, false);
    };

    PlayerController.prototype.zoomReset = function() {
        if (!this.isPlayerInputAllowed()) return;
        nc.trigger(nc.ns.client.game.zoomReset, false);
    };

    PlayerController.prototype.activateModifier = function() {
        if (!this.isPlayerInputAllowed()) return;
        Parent.prototype.activateModifier.call(this);
        nc.trigger(nc.ns.client.to.server.gameCommand.send, "activateModifier");
    };

    PlayerController.prototype.deactivateModifier = function() {
        if (!this.isPlayerInputAllowed()) return;
        Parent.prototype.deactivateModifier.call(this);
        nc.trigger(nc.ns.client.to.server.gameCommand.send, "deactivateModifier");
    };

    /*
     * Client overwrite - allow player input if PointerLock is locked to canvas
     * and is not in between games
     */
    PlayerController.prototype.isPlayerInputAllowed = function() {
        return pointerLockManager.isLocked() 
            && Parent.prototype.isPlayerInputAllowed.call(this);
    };

    
    return PlayerController;
});