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
        this.mousePosition = {x:0,y:0};
        this.modifier = false;
        this.swiper = null;
        this.lastLookDirection = 1;

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

        this.keyboardInput.registerKey(keys.a, this.moveLeft.bind(this), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.left, this.moveLeft.bind(this), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.d, this.moveRight.bind(this), bind2Pc('stop'));
        this.keyboardInput.registerKey(keys.right, this.moveRight.bind(this), bind2Pc('stop'));
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

    KeyboardAndMouse.prototype.moveLeft = function() {
        if (!this.modifier) {
            this.lastLookDirection = -1;
            this.onXyChange(this.lastLookDirection * Settings.VIEWPORT_LOOK_AHEAD, 0);
        }
        this.playerController.moveLeft()
    };

    KeyboardAndMouse.prototype.moveRight = function() {
        if (!this.modifier) {
            this.lastLookDirection = 1;
            this.onXyChange(this.lastLookDirection * Settings.VIEWPORT_LOOK_AHEAD, 0);
        }
        this.playerController.moveRight();
    };

    KeyboardAndMouse.prototype.mouseInit = function() {
    	var canvas = DomController.getCanvas();
    	var self = this;

        canvas.onmousedown = function(e) {
            self.mousePosition = {x:0,y:0};

            if(!self.playerController.player.isHoldingSomething()) {
                var options = {
                    x: self.x, 
                    y: self.y
                };
                self.playerController.handActionRequest(options);
            } else {
                self.swiper = new Swiper();

                self.draw({
                    movementX: 0,
                    movementY: 0
                });
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
                var options = self.swiper.swipeEnd(e.x, e.y);
                self.playerController.handActionRequest(options);
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

        this.lastLookDirection = this.x >= 0 ? 1 : -1;

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

        this.mousePosition.x += movementX;
        this.mousePosition.y += movementY;

        this.swiper.swipe(this.mousePosition.x, -this.mousePosition.y);
    };

    KeyboardAndMouse.prototype.activateModifier = function() {
        this.modifier = true;
    };
 
    KeyboardAndMouse.prototype.deactivateModifier = function() {
        this.modifier = false;
        this.x = this.lastLookDirection * Settings.VIEWPORT_LOOK_AHEAD;
        this.y = 0;
        this.onXyChange(this.x, this.y);
    };
    return KeyboardAndMouse;
 
});