define(function (){

    function InputController(player) {

        this.player = player;

        this._shift;
        this._isJumping;
    }

    InputController.prototype.moveLeft = function () {
        this.player.move(-1);
    }

    InputController.prototype.moveRight = function () {
        this.player.move(1);
    }

    InputController.prototype.stop = function () {
        this.player.stop();
    }

    InputController.prototype.jump = function () {
        this._isJumping = true;
        this.player.jump();
    }

    InputController.prototype.jumped = function () {
        this._isJumping = false;
    }

    InputController.prototype.jumping = function () {
        if (this._isJumping) {
            this.player.jumping();            
        }
    }

    InputController.prototype.duck = function () {
        this.player.duck();
    }

    InputController.prototype.standUp = function () {
        this.player.standUp();
    }

    InputController.prototype.activateShift = function () {
        this._shift = true;
    }

    InputController.prototype.deactivateShift = function () {
        this._shift = false;
    }

    InputController.prototype.update = function () {

    }

    return InputController;
});