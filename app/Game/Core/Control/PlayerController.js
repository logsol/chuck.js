define(function () {

    function PlayerController (player) {

        this.player = player;

        this._shift;
        this._isJumping;
        this._walkingDirectionStatus = 0;
    }

    PlayerController.prototype.moveLeft = function () {
        this.player.move(-1);
        this._walkingDirectionStatus = -1;
    }

    PlayerController.prototype.moveRight = function () {
        this.player.move(1);
        this._walkingDirectionStatus = 1;
    }

    PlayerController.prototype.stop = function () {
        this.player.stop();
        this._walkingDirectionStatus = 0;
    }

    PlayerController.prototype.jump = function () {
        this._isJumping = true;
        this.player.jump();
    }

    PlayerController.prototype.jumpStop = function () {
        this.player.jumpStop();
    }

    PlayerController.prototype.lookAt = function (options) {
        if(options) this.player.lookAt(options.x, options.y);
    }

    PlayerController.prototype.update = function () {
        if(this._walkingDirectionStatus != 0) {
            this.player.move(this._walkingDirectionStatus);
        }
    }

    PlayerController.prototype.destroy = function() {
        // extend if necessary
    };

    return PlayerController;
});