define([
    "Game/Core/Protocol/Parser"
],

function (Parser) {

    var Helper = {}

    Helper.encodeCommand = function (command, options){
        return Parser.encode(Helper.assemble(command, options));
    }

    Helper.assemble = function (command, options){
        var commands = {};
        commands[command] = options || null;
        return commands;
    }

    Helper.runCommands = function (message, callback){
        var commands = Parser.decode(message);
        
        for(var command in commands) {
            callback(command, commands[command]);
        }
    }

    return Helper;
    
});