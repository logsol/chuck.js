Chuck.Control.InputControlUnit = function() {
    var KEY_LEFT;
    var KEY_RIGHT;
    var KEY_UP;
    var KEY_DOWN;

    var _instance;
    var _ki;
    var _me;
    var _shift;
    var _isJumping;

    this.init();
}
Chuck.Control.InputControlUnit.prototype.InputControlUnit = function()  {
    this._me = Processor.getInstance().getMe();
    this._ki = KeyboardInput.getInstance();

    this._ki.registerKey(KEY_LEFT, this.moveLeft, this.stop, this.moveLeft);
    this._ki.registerKey(KEY_RIGHT, this.moveRight, this.stop, this.moveRight);
    this._ki.registerKey(KEY_UP, this.jump, this.jumped, this.jumping);
    this._ki.registerKey(KEY_DOWN, this.duck, this.standUp, this.duck);
    this._ki.registerKey(KEY_DOWN, this.activateShift, this.activateShift, this.deactivateShift);

    this._ki.registerKey(37, this.wasd);
    this._ki.registerKey(38, this.wasd);
    this._ki.registerKey(39, this.wasd);
    this._ki.registerKey(40, this.wasd);
}


Chuck.Control.InputControlUnit.prototype.wasd = function() {
    trace('wasd benutzen alter...');
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
