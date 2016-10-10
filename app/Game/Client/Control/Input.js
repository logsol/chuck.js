define([
	"Lib/Utilities/NotificationCenter"
],
 
function (nc) {
 
    function Input(playerController) {
        this.playerController = playerController;
    	this.x = null;
    	this.y = null
    }

    Input.prototype.onXyChange = function(x, y) {
    	this.x = x;
    	this.y = y;
        this.playerController.setXY(this.x, this.y);
    }
 
    return Input;
 
});