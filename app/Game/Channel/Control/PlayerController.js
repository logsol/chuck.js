define([
	"Game/Core/Control/PlayerController",
	"Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Protocol/Parser",
    "Game/Config/Settings"
],
 
function(Parent, Nc, Parser, Settings) {
 
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

    PlayerController.prototype.mePositionStateUpdate = function(update) {

        if(!this.player.doll) {
            console.warn('me state update, even though doll does not exist');
            return;
        }

        var difference = {
            x: Math.abs(update.p.x - this.player.doll.body.GetPosition().x),
            y: Math.abs(update.p.y - this.player.doll.body.GetPosition().y)
        }

        if(difference.x < Settings.PUNKBUSTER_DIFFERENCE_METERS
           || difference.y < Settings.PUNKBUSTER_DIFFERENCE_METERS) {
            this.player.doll.updatePositionState(update.p);
        } else {
            // HARD UPDATE FOR SELF
            console.log(this.player.user.options.nickname + ' is cheating.')
        }
    };

    return PlayerController;
 
});