Chuck.Control.KeyboardInput = function() {
    this._registry = {};
    this._inputControlUnit = null;
    
    this.init();
}

Chuck.Control.KeyboardInput.prototype.init = function() {	
    $(window).keydown($.proxy(this._onKeyDown, this));
    $(window).keyup($.proxy(this._onKeyUp, this));
}

Chuck.Control.KeyboardInput.prototype.setInputControlUnit = function(inputControlUnit) {	
    this._inputControlUnit = inputControlUnit;
}

Chuck.Control.KeyboardInput.prototype.registerKey = function(keyCode, onKeyDown, onKeyUp, onKeyFrame) {
    var key = new Chuck.Control.Key();
    key.setKeyDownFunction(onKeyDown);
    key.setKeyUpFunction(onKeyUp);
    key.setKeyFrameFunction(onKeyFrame);
    this._registry[keyCode] = key;
}

Chuck.Control.KeyboardInput.prototype._getKeyByKeyCode = function(keyCode) {
    return this._registry[keyCode];
}

Chuck.Control.KeyboardInput.prototype._onKeyDown = function(e) {
    var key = this._getKeyByKeyCode(e.keyCode);
    if (key && key.getActive() == false) {
        key.setActivityUpdateStatus(true);
        key.setActivityUpdateNeeded(true);
    }
}

Chuck.Control.KeyboardInput.prototype._onKeyUp = function(e) {
    var key = this._getKeyByKeyCode(e.keyCode);
    if (key != null) {
        key.setActivityUpdateStatus(false);
        key.setActivityUpdateNeeded(true);
    }
}

Chuck.Control.KeyboardInput.prototype.update = function() {
    var callback = null;
    var self = this;
    $.each(this._registry, function(keyCode, key) {
        if (key.getActivityUpdateNeeded()) {
            if (key.getActivityUpdateStatus() == true) {
                callback = key.getKeyDownFunction();
                key.setActive(true);
            } else {
                callback = key.getKeyUpFunction();
                key.setActive(false);
            }
            key.setActivityUpdateNeeded(false);
        }

        if (callback) {
            self._inputControlUnit[callback]();
        } else {
            if (key.getActive()) {
                callback = key.getKeyFrameFunction();
                if (callback) {
                    self._inputControlUnit[callback]();
                }
            }
        }
        callback = null;
    });
}