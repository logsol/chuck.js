define([
	"Game/Client/Control/Input",
	"Game/Client/Control/KeyboardInput",
	"Game/Client/View/DomController",
	"Game/Config/Settings",
],
 
function (Parent, KeyboardInput, DomController, Settings) {
 
    function KeyboardAndMouse(playerController) {
    	Parent.call(this);

        this.x = 0;
        this.y = 0;

    	this.playerController = playerController;
    	this.keyboardInit();
    	this.mouseInit();
    }

    KeyboardAndMouse.prototype = Object.create(Parent.prototype);

    KeyboardAndMouse.prototype.keyboardInit = function() {

    	this.keyboardInput = new KeyboardInput(this.playerController);

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

            plus: 187,
            plusfx: 171,
            minus: 189,
            minusfx: 173,
            zero: 48
        }

        this.keyboardInput.registerKey(keys.a, 'moveLeft', 'stop');
        this.keyboardInput.registerKey(keys.left, 'moveLeft', 'stop');
        
        this.keyboardInput.registerKey(keys.d, 'moveRight', 'stop');
        this.keyboardInput.registerKey(keys.right, 'moveRight', 'stop');
        
        this.keyboardInput.registerKey(keys.w, 'jump', 'jumpStop');
        this.keyboardInput.registerKey(keys.up, 'jump', 'jumpStop');
        this.keyboardInput.registerKey(keys.space, 'jump', 'jumpStop');

        this.keyboardInput.registerKey(keys.plus, 'zoomIn');
        this.keyboardInput.registerKey(keys.plusfx, 'zoomIn');
        this.keyboardInput.registerKey(keys.minus, 'zoomOut');
        this.keyboardInput.registerKey(keys.minusfx, 'zoomOut');
        this.keyboardInput.registerKey(keys.zero, 'zoomReset');

        this.keyboardInput.registerKey(keys.tab, 'showInfo', 'hideInfo');

        this.keyboardInput.registerKey(keys.f, 'handActionLeft');
        this.keyboardInput.registerKey(keys.g, 'handActionRight');

        this.keyboardInput.registerKey(keys.k, 'suicide');
    };

    KeyboardAndMouse.prototype.mouseInit = function() {

    	var canvas = DomController.getCanvas();
    	var self = this;

		canvas.onmousemove = function(e){

			// 		-1 +1   +1 +1		xy scaling should 
			// 		-1 -1   +1 -1		be like this

            var movementX = e.movementX ||
                e.mozMovementX          ||
                e.webkitMovementX       ||
                0;

            var movementY = e.movementY ||
                e.mozMovementY      ||
                e.webkitMovementY   ||
                0;

            self.x += movementX / Settings.VIEWPORT_SPEED_FACTOR;
            if(self.x > 1) {
                self.x = 1;
            }
            if(self.x < -1) {
                self.x = -1;
            };

            self.y -= movementY / Settings.VIEWPORT_SPEED_FACTOR;
            if(self.y > 1) {
                self.y = 1;
            }
            if(self.y < -1) {
                self.y = -1;
            }

			self.onXyChange(self.x, self.y);
		}
        
		canvas.onmousedown = function(e) {

			var x = (((e.clientX - this.offsetLeft) / Settings.STAGE_WIDTH) * 2) - 1;
			var y = (((Settings.STAGE_HEIGHT - (e.clientY - this.offsetTop)) / Settings.STAGE_HEIGHT) * 2) -1;

			self.playerController.handActionRequest(x, y);
		}
    };

    KeyboardAndMouse.prototype.update = function(e) {
        /*
        var movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0;

        var movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;

        //console.log(movementX, movementY);


        this.x += movementX;
        if(this.x > 1) {
            this.x = 1;
        }
        if(this.x < -1) {
            this.x = -1;
        };

        this.y += movementY;
        if(this.y > 1) {
            this.y = 1;
        }
        if(this.y < -1) {
            this.y = -1;
        }

        this.onXyChange(this.x, this.y);
        */
    };
 
    return KeyboardAndMouse;
 
});