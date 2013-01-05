define([
	"Game/Core/Player"
],
 
function(Parent) {
 
    function Player(id, physicsEngine) {
    	Parent.call(this, id, physicsEngine);

    	this.inputController = null;
    }

    Player.prototype = Object.create(Parent.prototype);
 
    Player.prototype.setInputController = function(inputController) {
    	this.inputController = inputController;
    }

    return Player;
 
});