define([
	"Lib/Utilities/NotificationCenter"
],
 
function (Nc) {
 
    function XyInput() {
    	this.x = null;
    	this.y = null
    }

    XyInput.prototype.onXyChange = function(x, y) {
    	this.x = x;
    	this.y = y;
    	Nc.trigger('input/onXyChange', x, y);
    }
 
    return XyInput;
 
});