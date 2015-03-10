define([
    "Game/Client/Control/Key"
], 

function (Key) {

    function KeyboardInput () {
        this.registry = {};        
        this.init();
    }

    KeyboardInput.prototype.init = function () {    
        // Using window is ok here because it only runs in the browser
        window.onkeydown = this.onKeyDown.bind(this);
        window.onkeyup = this.onKeyUp.bind(this);
    }

    KeyboardInput.prototype.registerKey = function (keyCode, onKeyDown, onKeyUp) {
        var key = new Key();
        if(onKeyDown) key.setKeyDownFunction(onKeyDown);
        if(onKeyUp) key.setKeyUpFunction(onKeyUp);
        this.registry[keyCode] = key;
    }

    KeyboardInput.prototype.getKeyByKeyCode = function (keyCode) {
        return this.registry[keyCode];
    }

    KeyboardInput.prototype.onKeyDown = function (e) {
        var key = this.getKeyByKeyCode(e.keyCode);

        if (key && !key.getActive()) {
            var callback = key.getKeyDownFunction();
            key.setActive(true);
            if(callback) callback();
        }
        
        // Prevent tab from changing focus
        if(e.keyCode == 9) return false;
    }

    KeyboardInput.prototype.onKeyUp = function (e) {
        var key = this.getKeyByKeyCode(e.keyCode);
        if (key && key.getActive()) {
            var callback = key.getKeyUpFunction();
            key.setActive(false);
            if(callback) callback();
        }

        // Prevent tab from changing focus
        if(e.keyCode == 9) return false;
    }

    return KeyboardInput;
});