define([
    "Game/Client/Control/Key"
], 

function (Key) {

    function KeyboardInput (playerController) {

        this._registry = {};
        this._playerController = playerController;
        
        this.init();
    }

    KeyboardInput.prototype.init = function () {    
        // Using window is ok here because it only runs in the browser
        window.onkeydown = this._onKeyDown.bind(this);
        window.onkeyup = this._onKeyUp.bind(this);
    }

    KeyboardInput.prototype.registerKey = function (keyCode, onKeyDown, onKeyUp, onKeyFrame) {
        var key = new Key();
        if(onKeyDown) key.setKeyDownFunction(onKeyDown);
        if(onKeyUp) key.setKeyUpFunction(onKeyUp);
        if(onKeyFrame) key.setKeyFrameFunction(onKeyFrame);
        this._registry[keyCode] = key;
    }

    KeyboardInput.prototype._getKeyByKeyCode = function (keyCode) {
        return this._registry[keyCode];
    }

    KeyboardInput.prototype._onKeyDown = function (e) {
        var key = this._getKeyByKeyCode(e.keyCode);

        if (key && !key.getActive()) {
            var callback = key.getKeyDownFunction();
            if(callback) this._playerController[callback]();
            key.setActive(true);
        }
    }

    KeyboardInput.prototype._onKeyUp = function (e) {
        var key = this._getKeyByKeyCode(e.keyCode);
        if (key && key.getActive()) {
            var callback = key.getKeyUpFunction();
            if(callback) this._playerController[callback]();
            key.setActive(false);
        }
    }

    /*
     * If KeyFrameFunction was set, it is executed when key is active
     */
    KeyboardInput.prototype.update = function () {
        var callback = null;

        for (var keyCode in this._registry) {
            var key = this._getKeyByKeyCode(keyCode);

            if (key.getActive()) {
                callback = key.getKeyFrameFunction();
                if (callback) {
                    this._playerController[callback]();
                }
            }
            
            callback = null;
        }
    }

    return KeyboardInput;
});