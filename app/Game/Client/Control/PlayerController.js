define([
    "Game/Core/Control/PlayerController", 
    "Game/Client/Control/KeyboardInput",
    "Game/Client/Control/Input/MouseInput",
    "Lib/Utilities/NotificationCenter"
], 

function (Parent, KeyboardInput, MouseInput, NotificationCenter) {

    function PlayerController (me) {

        Parent.call(this, me);

        this.keyboardInput = new KeyboardInput(this);
        this.xyInput = new MouseInput(this);

        NotificationCenter.on("input/onXyChange", this.setXY, this);
        NotificationCenter.on("input/onHandAction", this.handAction, this);

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

    PlayerController.prototype.setXY = function(x, y) {
        var options = {x:x, y:y};
        Parent.prototype.lookAt.call(this, options);
        NotificationCenter.trigger('sendGameCommand', 'lookAt', options);
    };

    PlayerController.prototype.handAction = function(x, y) {
        var options = {x:x, y:y};
        Parent.prototype.handAction.call(this, options);
        NotificationCenter.trigger("sendGameCommand", "handAction", options);
    };

    PlayerController.prototype.update = function () {
        this.keyboardInput.update();
        Parent.prototype.update.call(this);
    }



    return PlayerController;
});