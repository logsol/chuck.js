define([
    "Game/Core/Protocol/Parser",
    "Lib/Utilities/Exception"
],

function (Parser, Exception) {

    var Helper = {}

    Helper.encodeCommand = function (command, options) {
        var message = {};
        message[command] = options || null;
        return Parser.encode(message);
    }

    Helper.applyCommand = function(options, target) {

        var message;
        if (typeof options == "string") {
            message = Parser.decode(options);
        } else {
            message = options;
        }
        
        // The for loop is only here to get the key, it is not designed to get multiple commands
        for(var command in message) {
            var methodName = "on" + command.toUpperCaseFirstChar();
            var options = message[command];

            if (!target[methodName]) {   
                throw new Exception("Helper.applyCommand:", target, "has no method", methodName);
            }

            target[methodName].call(target, options);
        }
    };

    return Helper;
    
});