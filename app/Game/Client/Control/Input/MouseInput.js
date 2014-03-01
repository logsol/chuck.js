define([
	"Game/Client/Control/Input/XyInput",
	"Game/Client/View/DomController",
	"Game/Config/Settings",
	"Lib/Utilities/NotificationCenter"
],
 
function (Parent, DomController, Settings, Nc) {
 
    function MouseInput() {
    	Parent.call(this);

    	this.init();
    }

    MouseInput.prototype = Object.create(Parent.prototype);

    MouseInput.prototype.init = function() {
    	
    	var canvas = null;
    	var self = this;
		canvas = DomController.getCanvas();

		canvas.onmousemove = function(e){

			// 		-1 +1   +1 +1		xy scaling should 
			// 		-1 -1   +1 -1		be like this

			var x = (((e.clientX - this.offsetLeft) / Settings.STAGE_WIDTH) * 2) - 1;
			var y = (((Settings.STAGE_HEIGHT - (e.clientY - this.offsetTop)) / Settings.STAGE_HEIGHT) * 2) -1;

			self.onXyChange(x, y);
		}

		canvas.onmousedown = function(e) {

			var x = (((e.clientX - this.offsetLeft) / Settings.STAGE_WIDTH) * 2) - 1;
			var y = (((Settings.STAGE_HEIGHT - (e.clientY - this.offsetTop)) / Settings.STAGE_HEIGHT) * 2) -1;

			Nc.trigger("input/onHandActionRequest", x, y);
		}
    };

 
    return MouseInput;
 
});
