define(["Game/Client/Control/Key"], function (Key){

    function KeyboardInput (keyboardController) {

        this._registry = {};
        this._keyboardController = keyboardController;
        
        this.init();
    }

    KeyboardInput.prototype.init = function () {    
        // Using window is ok here because it only runs in the browser
        window.onkeydown = this._onKeyDown.bind(this);
        window.onkeyup = this._onKeyUp.bind(this);
    }

    KeyboardInput.prototype.registerKey = function (keyCode, onKeyDown, onKeyUp, onKeyFrame) {
        var key = new Key();
        key.setKeyDownFunction(onKeyDown);
        key.setKeyUpFunction(onKeyUp);
        key.setKeyFrameFunction(onKeyFrame);
        this._registry[keyCode] = key;
    }

    KeyboardInput.prototype._getKeyByKeyCode = function (keyCode) {
        return this._registry[keyCode];
    }

    KeyboardInput.prototype._onKeyDown = function (e) {
        var key = this._getKeyByKeyCode(e.keyCode);
        if (key && key.getActive() == false) {
            key.setActivityUpdateStatus(true);
            key.setActivityUpdateNeeded(true);
        }
    }

    KeyboardInput.prototype._onKeyUp = function (e) {
        var key = this._getKeyByKeyCode(e.keyCode);
        if (key != null) {
            key.setActivityUpdateStatus(false);
            key.setActivityUpdateNeeded(true);
        }
    }

    KeyboardInput.prototype.update = function () {
        var callback = null;
        var self = this;

        for (var keyCode in this._registry) {
            var key = this._registry[keyCode];

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
                self._keyboardController[callback]();
            } else {
                if (key.getActive()) {
                    callback = key.getKeyFrameFunction();
                    if (callback) {
                        self._keyboardController[callback]();
                    }
                }
            }
            callback = null;
        }
    }

    return KeyboardInput;
});