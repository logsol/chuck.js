define([
    "Game/Core/Control/PlayerController", 
    "Game/Client/Control/KeyboardInput",
    "Game/Client/Control/Input/MouseInput",
    "Lib/Utilities/NotificationCenter"
], 

function (Parent, KeyboardInput, MouseInput, Nc) {

    function PlayerController (me) {

        Parent.call(this, me);

        this.keyboardInput = new KeyboardInput(this);
        this.xyInput = new MouseInput(this);

        this.ncTokens = [
            Nc.on(Nc.ns.client.input.xy.change, this.setXY, this),
            Nc.on(Nc.ns.client.input.handAction.request, this.handActionRequest, this)
        ];

        var keys = {
            w:87,
            a:65,
            s:83,
            d:68,

            f:70,
            g:71,
            k:75,

            up: 38,
            left: 37,
            down: 40,
            right: 39,

            space: 32,

            tab: 9
        }

        this.init(keys);
    }

    PlayerController.prototype = Object.create(Parent.prototype);

    PlayerController.prototype.init = function (keys)  {
        
        this.keyboardInput.registerKey(keys.a, 'moveLeft', 'stop');
        this.keyboardInput.registerKey(keys.left, 'moveLeft', 'stop');
        
        this.keyboardInput.registerKey(keys.d, 'moveRight', 'stop');
        this.keyboardInput.registerKey(keys.right, 'moveRight', 'stop');
        
        this.keyboardInput.registerKey(keys.w, 'jump', 'jumpStop');
        this.keyboardInput.registerKey(keys.up, 'jump', 'jumpStop');
        this.keyboardInput.registerKey(keys.space, 'jump', 'jumpStop');

        this.keyboardInput.registerKey(keys.tab, 'showInfo', 'hideInfo');

        this.keyboardInput.registerKey(keys.f, 'handActionLeft');
        this.keyboardInput.registerKey(keys.g, 'handActionRight');

        this.keyboardInput.registerKey(keys.k, 'suicide');
    }

    PlayerController.prototype.moveLeft = function () {
        Parent.prototype.moveLeft.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'moveLeft');
    }

    PlayerController.prototype.moveRight = function () {
        Parent.prototype.moveRight.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'moveRight');
    }

    PlayerController.prototype.stop = function () {
        Parent.prototype.stop.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'stop');
    }

    PlayerController.prototype.jump = function () {
        Parent.prototype.jump.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'jump');
    }

    PlayerController.prototype.jumpStop = function () {
        Parent.prototype.jumpStop.call(this);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'jumpStop');
    }

    PlayerController.prototype.setXY = function(x, y) {
        var options = {x:x, y:y};
        Parent.prototype.lookAt.call(this, options);
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, 'lookAt', options);
    };

    PlayerController.prototype.handActionLeft = function() {
        this.handActionRequest(-0.5, 0.5);
    };

    PlayerController.prototype.handActionRight = function() {
        this.handActionRequest(0.5, 0.5);
    };

    PlayerController.prototype.suicide = function() {
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "suicide");
    };

    PlayerController.prototype.handActionRequest = function(x, y) {
        var options = {x:x, y:y};
        Nc.trigger(Nc.ns.client.to.server.gameCommand.send, "handActionRequest", options);
    };

    PlayerController.prototype.showInfo = function() {
        Nc.trigger(Nc.ns.client.game.gameInfo.toggle, true);
    };

    PlayerController.prototype.hideInfo = function() {
        Nc.trigger(Nc.ns.client.game.gameInfo.toggle, false);
    };

    PlayerController.prototype.destroy = function() {
        Nc.offAll(this.ncTokens);
        Parent.prototype.destroy.call(this);
    };


    return PlayerController;
});