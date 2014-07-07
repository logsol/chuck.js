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

    KeyboardInput.prototype.registerKey = function (keyCode, onKeyDown, onKeyUp) {
        var key = new Key();
        if(onKeyDown) key.setKeyDownFunction(onKeyDown);
        if(onKeyUp) key.setKeyUpFunction(onKeyUp);
        this._registry[keyCode] = key;
    }

    KeyboardInput.prototype._getKeyByKeyCode = function (keyCode) {
        return this._registry[keyCode];
    }

    KeyboardInput.prototype._onKeyDown = function (e) {
        console.log(e.keyCode)
        var key = this._getKeyByKeyCode(e.keyCode);

        if (key && !key.getActive()) {
            var callback = key.getKeyDownFunction();
            if(callback) this._playerController[callback]();
            key.setActive(true);
        }
        
        // Prevent tab from changing focus
        if(e.keyCode == 9) return false;
    }

    KeyboardInput.prototype._onKeyUp = function (e) {
        var key = this._getKeyByKeyCode(e.keyCode);
        if (key && key.getActive()) {
            var callback = key.getKeyUpFunction();
            if(callback) this._playerController[callback]();
            key.setActive(false);
        }

        // Prevent tab from changing focus
        if(e.keyCode == 9) return false;
    }

    return KeyboardInput;
});