define([
	"Game/Core/Control/PlayerController",
	"Game/Core/NotificationCenter",
    "Game/Core/Protocol/Parser"
],
 
function(Parent, NotificationCenter, Parser) {
 
    function PlayerController(player) {

    	Parent.call(this, player);
    }

    PlayerController.prototype = Object.create(Parent.prototype);

    /* 
     * retrieves move (and other) commands from client and executes them at the server 
     */ 
    PlayerController.prototype.applyCommand = function(options) {
        var message;
        if (typeof options == "string") {
            message = Parser.decode(options);
        } else {
            message = options;
        }

        for (var command in message) {
            this[command].call(this, message[command]);
        }
    };

    return PlayerController;
 
});