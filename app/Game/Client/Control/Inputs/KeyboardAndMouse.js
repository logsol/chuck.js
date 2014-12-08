define([
	"Game/Client/Control/Input",
	"Game/Client/Control/KeyboardInput",
	"Game/Client/View/DomController",
	"Game/Config/Settings",
    "Game/Client/Control/Swiper"
],
 
function (Parent, KeyboardInput, DomController, Settings, Swiper) {
 
    function KeyboardAndMouse(playerController) {
    	Parent.call(this);

        this.x = 0;
        this.y = 0;
        this.modifier = false;
        this.swiper = null;

    	this.playerController = playerController;
    	this.keyboardInit();
    	this.mouseInit();
    }

    KeyboardAndMouse.prototype = Object.create(Parent.prototype);

    KeyboardAndMouse.prototype.keyboardInit = function() {

    	this.keyboardInput = new KeyboardInput();
        var self = this;

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
            tab: 9,
            shift: 16,

            plus: 187,
            plusfx: 171,
            minus: 189,
            minusfx: 173,
            zero: 48
        }

        function bind2Pc(methodName) {
            return self.playerController[methodName].bind(self.playerController);
        }

        this.keyboardInput.registerKey(keys.a, bind2Pc('moveLeft'), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.left, bind2Pc('moveLeft'), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.d, bind2Pc('moveRight'), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.right, bind2Pc('moveRight'), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.w, bind2Pc('jump'), bind2Pc('jumpStop'));
        this.keyboardInput.registerKey(keys.up, bind2Pc('jump'), bind2Pc('jumpStop'));
        this.keyboardInput.registerKey(keys.space, bind2Pc('jump'), bind2Pc('jumpStop'));
        this.keyboardInput.registerKey(keys.plus, bind2Pc('zoomIn'));
        this.keyboardInput.registerKey(keys.plusfx, bind2Pc('zoomIn'));
        this.keyboardInput.registerKey(keys.minus, bind2Pc('zoomOut'));
        this.keyboardInput.registerKey(keys.minusfx, bind2Pc('zoomOut'));
        this.keyboardInput.registerKey(keys.zero, bind2Pc('zoomReset'));
        this.keyboardInput.registerKey(keys.tab, bind2Pc('showInfo'), bind2Pc('hideInfo'));
        this.keyboardInput.registerKey(keys.f, bind2Pc('handActionLeft'));
        this.keyboardInput.registerKey(keys.g, bind2Pc('handActionRight'));
        this.keyboardInput.registerKey(keys.k, bind2Pc('suicide'));

        this.keyboardInput.registerKey(
            keys.shift,
            this.activateModifier.bind(this),
            this.deactivateModifier.bind(this)
        );
    };

    KeyboardAndMouse.prototype.mouseInit = function() {
    	var canvas = DomController.getCanvas();
    	var self = this;

        canvas.onmousedown = function(e) {
            if(!self.playerController.player.isHoldingSomething()) {
                self.playerController.handActionRequest(self.x, self.y);
            } else {
                self.swiper = new Swiper();
            }
        }

		canvas.onmousemove = function(e) {
            if (self.swiper) {
                self.draw(e);
            } else if(self.modifier) {
                self.updateViewport(e);
            }
		}

        canvas.onmouseup = function(e) {
            if(self.swiper) {
                var xya = self.swiper.swipeEnd(e.x, e.y);
                self.playerController.handActionRequest(xya.x, xya.y);
                self.swiper = null;
            }
        }
    };

    KeyboardAndMouse.prototype.updateViewport = function(e) {
        //      -1 +1   +1 +1       xy scaling should 
        //      -1 -1   +1 -1       be like this

        var movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0;

        var movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;

        this.x += movementX / Settings.VIEWPORT_SPEED_FACTOR;
        if(this.x > 1) {
            this.x = 1;
        }
        if(this.x < -1) {
            this.x = -1;
        };

        this.y -= movementY / Settings.VIEWPORT_SPEED_FACTOR;
        if(this.y > 1) {
            this.y = 1;
        }
        if(this.y < -1) {
            this.y = -1;
        }

        this.onXyChange(this.x, this.y);
    };

    KeyboardAndMouse.prototype.draw = function(e) {
        var movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0;

        var movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;

        this.swiper.swipe(movementX, -movementY);
    };

    KeyboardAndMouse.prototype.activateModifier = function() {
        this.modifier = true;
    };
 
    KeyboardAndMouse.prototype.deactivateModifier = function() {
        this.modifier = false;
        this.x = 0.3;
        this.y = 0;
        this.onXyChange(this.x, this.y);
    };
    return KeyboardAndMouse;
 
});