define([
    "Game/Core/Control/InputController", 
    "Game/Client/Control/KeyboardInput",
    "Game/Core/NotificationCenter"
], 

function (InputController, KeyboardInput, NotificationCenter) {

    function KeyboardController (me, gameController) {

        this.gameController = gameController;
        this.inputController = new InputController(me);

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

    KeyboardController.prototype.init = function (keys)  {

        this.keyboardInput.registerKey(keys.a, 'moveLeft', 'stop', 'moveLeft');
        this.keyboardInput.registerKey(keys.left, 'moveLeft', 'stop', 'moveLeft');
        
        this.keyboardInput.registerKey(keys.d, 'moveRight', 'stop', 'moveRight');
        this.keyboardInput.registerKey(keys.right, 'moveRight', 'stop', 'moveRight');
        
        this.keyboardInput.registerKey(keys.w, 'jump', 'jumped', 'jumping');
        this.keyboardInput.registerKey(keys.up, 'jump', 'jumped', 'jumping');
        
        this.keyboardInput.registerKey(keys.s, 'duck', 'standUp', 'duck');
        this.keyboardInput.registerKey(keys.down, 'duck', 'standUp', 'duck');
        
        this.keyboardInput.registerKey(keys.s, 'activateShift', 'activateShift', 'deactivateShift');
        this.keyboardInput.registerKey(keys.down, 'activateShift', 'activateShift', 'deactivateShift');
    }

    KeyboardController.prototype.moveLeft = function () {
        this.inputController.moveLeft();
        NotificationCenter.trigger('sendGameCommand', 'moveLeft');
    }

    KeyboardController.prototype.moveRight = function () {
        this.inputController.moveRight();
        NotificationCenter.trigger('sendGameCommand', 'moveRight');
    }

    KeyboardController.prototype.stop = function () {
        this.inputController.stop();
        NotificationCenter.trigger('sendGameCommand', 'stop');
    }

    KeyboardController.prototype.jump = function () {
        this.inputController.jump();
        NotificationCenter.trigger('sendGameCommand', 'jump');
    }

    KeyboardController.prototype.jumped = function () {
        this.inputController.jumped();
    }

    KeyboardController.prototype.jumping = function () {
        this.inputController.jumping();
    }

    KeyboardController.prototype.duck = function () {
        this.inputController.duck();
        NotificationCenter.trigger('sendGameCommand', 'duck');
    }

    KeyboardController.prototype.standUp = function () {
        this.inputController.standUp();
    }

    KeyboardController.prototype.activateShift = function () {
        this.inputController.activateShift();
        NotificationCenter.trigger('sendGameCommand', 'activateShift');
    }

    KeyboardController.prototype.deactivateShift = function () {
        this.inputController.deactivateShift();
    }

    KeyboardController.prototype.update = function () {
        this.keyboardInput.update();
    }

    return KeyboardController;
});