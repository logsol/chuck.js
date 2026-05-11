define([
	"Game/Core/Control/PlayerController",
	"Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Protocol/Parser"
],

function(Parent, nc, Parser) {

    "use strict";
 
    function PlayerController(player) {

    	Parent.call(this, player);
        this._lastProcessedSeq = 0;
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
            var commandOptions = message[command];

            // Track sequence number from client input commands
            if (commandOptions && typeof commandOptions === 'object' && commandOptions._seq !== undefined) {
                this._lastProcessedSeq = commandOptions._seq;
            }

            this[command].call(this, commandOptions);
        }
    };

    PlayerController.prototype.handActionRequest = function(options) {
        options.x = parseFloat(options.x) || 0.0;
        options.y = parseFloat(options.y) || 0.0;
        options.av = parseFloat(options.av) || 0.0;
        if (options) this.player.handActionRequest(options);
    };

    PlayerController.prototype.suicide = function() {
        this.player.suicide();
    };

    return PlayerController;
 
});