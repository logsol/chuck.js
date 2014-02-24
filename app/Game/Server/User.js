define([
	"Game/Core/User",
	"Lib/Utilities/NotificationCenter",
	"Lib/Utilities/Protocol/Helper",
    "Lib/Utilities/Protocol/Parser",
],
 
function(Parent, NotificationCenter, ProtocolHelper, ProtocolParser) {
 
    function User(id, channel) {
    	Parent.call(this, id);

    	this.channel = channel;
        this.player = null;
        this.isReady = false;
    	var self = this;

    	NotificationCenter.on('user/joined', function(user) { // FIXME: use sendToAllUsersExcept instead
    		if(user.id != self.id) {
    			self.sendControlCommand("userJoined", user.id);    			
    		}
    	});

    	NotificationCenter.on('user/' + this.id + "/joinSuccess", function(options) {
    		self.sendControlCommand("joinSuccess", options);
    	});

        NotificationCenter.on('user/' + this.id + "/controlCommand", function(message) {
            ProtocolHelper.applyCommand(message.data, self);
        });

        NotificationCenter.on('user/' + this.id + "/gameCommand", function(command, options) {
            self.sendGameCommand(command, options);
        });
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
            NotificationCenter.trigger("user/resetLevel", this.id);
        } else if(command.hasOwnProperty("clientReady")) {
            this.isReady = true;
            NotificationCenter.trigger("user/clientReady", this.id);
        } else {
            this.player.playerController.applyCommand(command);
        }

    };


    // Sending commands

    User.prototype.sendControlCommand = function(command, options) {
    	var recipient = "user/" + this.id;
		var data = ProtocolHelper.encodeCommand(command, options);

    	NotificationCenter.trigger("process/message", recipient, data);
    };

    User.prototype.sendGameCommand = function(command, options) {
        if(this.isReady) {
            var data = ProtocolHelper.encodeCommand(command, options);
            this.sendControlCommand("gameCommand", data);            
        }
    };


    return User;
 
});