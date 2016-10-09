define([
],
 
function () {

    function PlayerController (player) {
        this.player = player;
        this._walkingDirectionStatus = 0;
    }

    PlayerController.prototype.moveLeft = function () {
        if(!this.isPlayerInputAllowed()) return;
        this.player.move(-1);
        this._walkingDirectionStatus = -1;
    }

    PlayerController.prototype.moveRight = function () {
        if(!this.isPlayerInputAllowed()) return;
        this.player.move(1);
        this._walkingDirectionStatus = 1;
    }

    PlayerController.prototype.stop = function () {
        this.player.stop();
        this._walkingDirectionStatus = 0;
    }

    PlayerController.prototype.jump = function () {
        if(!this.isPlayerInputAllowed()) return;
        this.player.jump();
    }

    PlayerController.prototype.jumpStop = function () {
        this.player.jumpStop();
    }

    PlayerController.prototype.lookAt = function (options) {
        if(!this.isPlayerInputAllowed()) return;
        if(options) this.player.lookAt(options.x, options.y);
    }

    PlayerController.prototype.activateModifier = function() {
        if (!this.isPlayerInputAllowed()) return;
        this.player.activateModifier();
    };

    PlayerController.prototype.deactivateModifier = function() {
        if (!this.isPlayerInputAllowed()) return;
        this.player.deactivateModifier();
    };

    PlayerController.prototype.update = function () {
        if(this._walkingDirectionStatus != 0) {
            this.player.move(this._walkingDirectionStatus);
        }
    }

    // Default behaviour - may be needed later? 
    PlayerController.prototype.isPlayerInputAllowed = function() {
        return true;
    };

    PlayerController.prototype.destroy = function() {
        // extend if necessary
    };

    return PlayerController;
});