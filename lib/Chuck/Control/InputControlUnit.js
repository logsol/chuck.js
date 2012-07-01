define(["Chuck/Control/KeyboardInput"], function(KeyboardInput){

    function InputControlUnit(me) {

        this._keyboardInput = new KeyboardInput(this);
        this._me = me;

        this._shift;
        this._isJumping;
        
        this.KEY_LEFT = 65;
        this.KEY_RIGHT = 68;
        this.KEY_UP = 87;
        this.KEY_DOWN = 83;

        this.init();
    }

    InputControlUnit.prototype.init = function()  {
        this._keyboardInput.registerKey(this.KEY_LEFT, 'moveLeft', 'stop', 'moveLeft');
        this._keyboardInput.registerKey(this.KEY_RIGHT, 'moveRight', 'stop', 'moveRight');
        this._keyboardInput.registerKey(this.KEY_UP, 'jump', 'jumped', 'jumping');
        this._keyboardInput.registerKey(this.KEY_DOWN, 'duck', 'standUp', 'duck');
        this._keyboardInput.registerKey(this.KEY_DOWN, 'activateShift', 'activateShift', 'deactivateShift');
    }

    InputControlUnit.prototype.moveLeft = function() {
        this._me.move(-1);
    }

    InputControlUnit.prototype.moveRight = function() {
        this._me.move(1);
    }

    InputControlUnit.prototype.stop = function() {
        this._me.stop();
    }

    InputControlUnit.prototype.jump = function() {
        this._isJumping = true;
        this._me.jump();
    }

    InputControlUnit.prototype.jumped = function() {
        this._isJumping = false;
    }

    InputControlUnit.prototype.jumping = function() {
        if (this._isJumping) {
            this._me.jumping();			
        }
    }

    InputControlUnit.prototype.duck = function() {
        this._me.duck();
    }

    InputControlUnit.prototype.standUp = function() {
        this._me.standUp();
    }

    InputControlUnit.prototype.activateShift = function() {
        this._shift = true;
    }

    InputControlUnit.prototype.deactivateShift = function() {
        this._shift = false;
    }

    InputControlUnit.prototype.update = function() {
        this._keyboardInput.update();
    }

    return InputControlUnit;
});