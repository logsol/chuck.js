define([
	"Game/Core/User",
	"Lib/Utilities/NotificationCenter",
	"Lib/Utilities/Protocol/Helper",
    "Lib/Utilities/Protocol/Parser",
],
 
function(Parent, Nc, ProtocolHelper, ProtocolParser) {
 
    function User(id, options) {
    	Parent.call(this, id, options);

        this.player = null;
        this.isReady = false;
    	var self = this;

    	Nc.on(Nc.ns.channel.to.client.user.controlCommand.joinSuccess + this.id, function(options) {
    		self.sendControlCommand("joinSuccess", options);
    	});

        Nc.on('user/' + this.id + "/controlCommand", function(message) {
            ProtocolHelper.applyCommand(message.data, self);
        });

        /*
        couldnt find trigger for this while refactoring
        Nc.on('user/' + this.id + "/gameCommand", function(command, options) {
            self.sendGameCommand(command, options);
        });
        */
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.setPlayer = function(player) {
        this.player = player;
    };


    // User command callbacks

    User.prototype.onGameCommand = function(command) {

        if (typeof command == "string") {
            command = ProtocolParser.decode(command);
        } // FIXME: move this to Protocol helper as a function

        if(command.hasOwnProperty("resetLevel")) {
            Nc.trigger(Nc.ns.channel.events.user.level.reset, this.id);
        } else if(command.hasOwnProperty("clientReady")) {
            this.isReady = true;
            Nc.trigger(Nc.ns.channel.events.user.client.ready, this.id);
        } else {
            this.player.playerController.applyCommand(command);
        }

    };


    // Sending commands

    User.prototype.sendControlCommand = function(command, options) {
    	var recipient = "user/" + this.id;
		var data = ProtocolHelper.encodeCommand(command, options);

    	Nc.trigger(Nc.ns.channel.to.server.controlCommand.send, recipient, data);
    };

    User.prototype.sendGameCommand = function(command, options) {
        if(this.isReady) {
            var data = ProtocolHelper.encodeCommand(command, options);
            this.sendControlCommand("gameCommand", data);            
        }
    };


    return User;
 
});