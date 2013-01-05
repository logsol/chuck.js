define([
	"Game/Core/Control/InputController",
	"Game/Core/NotificationCenter",
    "Game/Core/Protocol/Parser"
],
 
function(Parent, NotificationCenter, Parser) {
 
    function InputController(player) {

    	Parent.call(this, player);
    }

    InputController.prototype = Object.create(Parent.prototype);

    InputController.prototype.applyCommand = function(options) {
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

    return InputController;
 
});