define([
    "Game/Core/Control/PlayerController", 
    "Game/Client/Control/KeyboardInput",
    "Game/Core/NotificationCenter"
], 

function (Parent, KeyboardInput, NotificationCenter) {

    function PlayerController (me) {

        Parent.call(this, me);

        this.keyboardInput = new KeyboardInput(this);

        var keys = {
            w:87,
            a:65,
            s:83,
            d:68,

            up: 38,
            left: 37,
            down: 40,
            right: 39            
        }

        this.init(keys);
    }

    PlayerController.prototype = Object.create(Parent.prototype);

    PlayerController.prototype.init = function (keys)  {
        
        this.keyboardInput.registerKey(keys.a, 'moveLeft', 'stop');
        this.keyboardInput.registerKey(keys.left, 'moveLeft', 'stop');
        
        this.keyboardInput.registerKey(keys.d, 'moveRight', 'stop');
        this.keyboardInput.registerKey(keys.right, 'moveRight', 'stop');
        
        this.keyboardInput.registerKey(keys.w, 'jump');
        this.keyboardInput.registerKey(keys.up, 'jump');
    }

    PlayerController.prototype.moveLeft = function () {
        Parent.prototype.moveLeft.call(this);
        NotificationCenter.trigger('sendGameCommand', 'moveLeft');
    }

    PlayerController.prototype.moveRight = function () {
        Parent.prototype.moveRight.call(this);
        NotificationCenter.trigger('sendGameCommand', 'moveRight');
    }

    PlayerController.prototype.stop = function () {
        Parent.prototype.stop.call(this);
        NotificationCenter.trigger('sendGameCommand', 'stop');
    }

    PlayerController.prototype.jump = function () {
        Parent.prototype.jump.call(this);
        NotificationCenter.trigger('sendGameCommand', 'jump');
    }

    PlayerController.prototype.update = function () {
        this.keyboardInput.update();
        Parent.prototype.update.call(this);
    }

    return PlayerController;
});