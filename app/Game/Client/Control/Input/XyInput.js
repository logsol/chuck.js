define([
	"Lib/Utilities/NotificationCenter"
],
 
function (NotificationCenter) {
 
    function XyInput() {
    	this.x = null;
    	this.y = null
    }

    XyInput.prototype.onXyChange = function(x, y) {
    	this.x = x;
    	this.y = y;
    	NotificationCenter.trigger('onXyChange', x, y);
    }


 
    return XyInput;
 
});