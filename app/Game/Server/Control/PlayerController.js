define([
	"Game/Core/Control/PlayerController",
	"Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Protocol/Parser"
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
        // FIXME: remove this function and use ProtocolHelper.applyCommand() instead
        // Don't forget to change the function names to on...
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

    PlayerController.prototype.handActionRequest = function(options) {
        if (options) this.player.handActionRequest(options.x, options.y);
    };

    PlayerController.prototype.suicide = function() {
        this.player.suicide();
    };

    return PlayerController;
 
});