Chuck.Control.InputControlUnit = function(ki, me) {
    this._ki = ki;
    this._me = me;

    this._shift;
    this._isJumping;
    
    this.KEY_LEFT = 65;
    this.KEY_RIGHT = 68;
    this.KEY_UP = 87;
    this.KEY_DOWN = 83;

    this.init();
}

Chuck.Control.InputControlUnit.prototype.init = function()  {
    
    this._ki.setInputControlUnit(this);
    
    this._ki.registerKey(this.KEY_LEFT, 'moveLeft', 'stop', 'moveLeft');
    this._ki.registerKey(this.KEY_RIGHT, 'moveRight', 'stop', 'moveRight');
    this._ki.registerKey(this.KEY_UP, 'jump', 'jumped', 'jumping');
    this._ki.registerKey(this.KEY_DOWN, 'duck', 'standUp', 'duck');
    this._ki.registerKey(this.KEY_DOWN, 'activateShift', 'activateShift', 'deactivateShift');
}

Chuck.Control.InputControlUnit.prototype.moveLeft = function() {
    this._me.move(-1);
}

Chuck.Control.InputControlUnit.prototype.moveRight = function() {
    this._me.move(1);
}

Chuck.Control.InputControlUnit.prototype.stop = function() {
    this._me.stop();
}

Chuck.Control.InputControlUnit.prototype.jump = function() {
    this._isJumping = true;
    this._me.jump();
}

Chuck.Control.InputControlUnit.prototype.jumped = function() {
    this._isJumping = false;
}

Chuck.Control.InputControlUnit.prototype.jumping = function() {
    if (this._isJumping) {
        this._me.jumping();			
    }
}

Chuck.Control.InputControlUnit.prototype.duck = function() {
    this._me.duck();
}

Chuck.Control.InputControlUnit.prototype.standUp = function() {
    this._me.standUp();
}

Chuck.Control.InputControlUnit.prototype.activateShift = function() {
    this._shift = true;
}

Chuck.Control.InputControlUnit.prototype.deactivateShift = function() {
    this._shift = false;
}
