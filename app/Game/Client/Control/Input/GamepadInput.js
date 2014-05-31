define([
	"Game/Client/Control/Input/XyInput",
	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, Settings, Nc) {
 
    function GamepadInput(playerController) {
    	this.playerController = playerController;
    	Parent.call(this);

    	this.gamepad = null;
    	this.oldHoldingPressure = 0;
    	this.keyChanged = {
    		w: false,
    		a: false,
    		d: false
    	};
    	var self = this;

    	window.addEventListener("gamepadconnected", function(e) {
    		self.gamepad = e.gamepad;
		});

		window.addEventListener("gamepaddisconnected", function(e) {
			self.gamepad = null;
		});
    }

    GamepadInput.prototype = Object.create(Parent.prototype);

    GamepadInput.prototype.update = function() {
    	if(this.gamepad) {
    		var x = this.gamepad.axes[2];
    		var y = -this.gamepad.axes[3];

    		// Looking direction
    		this.playerController.xyInput.onXyChange(x, y);

    		// Pointer finger holding item
    		var holdingPressure = this.gamepad.axes[5];
    		if((holdingPressure > 0 && this.oldHoldingPressure <= 0)
    			|| (holdingPressure <= 0 && this.oldHoldingPressure > 0)) {
    			this.playerController.handActionRequest(x, y);
    		}
    		this.oldHoldingPressure = holdingPressure;

    		this.simulateKeyboard();
    	}
    };

    GamepadInput.prototype.simulateKeyboard = function() {
		// walking
		/*
		a:0 b:1 x:2 y:3 
		lb:4 rb:5 jl:6 jr:7
		start:8 back:9 xbox:10
		u:11 d:12 l:13 r:14
		*/
		this.key(11, 87);
		this.key(13, 65);
		this.key(14, 68);
    };

    GamepadInput.prototype.key = function(i, key) {
		if(this.keyChanged[key] != this.gamepad.buttons[i].pressed) {
  			var evt = {keyCode:key}
  			if(this.gamepad.buttons[i].pressed) window.onkeydown(evt);
  			else window.onkeyup(evt)

			this.keyChanged[key] = this.gamepad.buttons[i].pressed;
		}
    };

 
    return GamepadInput;
 
});
