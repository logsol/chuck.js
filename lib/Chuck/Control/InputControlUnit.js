define(["Chuck/Control/InputController", "Chuck/Control/KeyboardInput"], function(InputController, KeyboardInput){

    function InputControlUnit(me, clientProcessor) {

        this.clientProcessor = clientProcessor;
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

    InputControlUnit.prototype.init = function(keys)  {

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

    InputControlUnit.prototype.moveLeft = function() {
        this.inputController.moveLeft();
        this.clientProcessor.sendGameCommand('moveLeft');
    }

    InputControlUnit.prototype.moveRight = function() {
        this.inputController.moveRight();
        this.clientProcessor.sendGameCommand('moveRight');
    }

    InputControlUnit.prototype.stop = function() {
        this.inputController.stop();
        this.clientProcessor.sendGameCommand('stop');
    }

    InputControlUnit.prototype.jump = function() {
        this.inputController.jump();
        this.clientProcessor.sendGameCommand('jump');
    }

    InputControlUnit.prototype.jumped = function() {
        this.inputController.jumped();
    }

    InputControlUnit.prototype.jumping = function() {
        this.inputController.jumping();
    }

    InputControlUnit.prototype.duck = function() {
        this.inputController.duck();
        this.clientProcessor.sendGameCommand('duck');
    }

    InputControlUnit.prototype.standUp = function() {
        this.inputController.standUp();
    }

    InputControlUnit.prototype.activateShift = function() {
        this.inputController.activateShift();
        this.clientProcessor.sendGameCommand('activateShift');
    }

    InputControlUnit.prototype.deactivateShift = function() {
        this.inputController.deactivateShift();
    }

    InputControlUnit.prototype.update = function() {
        this.keyboardInput.update();
    }

    return InputControlUnit;
});