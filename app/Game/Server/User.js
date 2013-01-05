define([
	"Game/Core/User",
	"Game/Core/NotificationCenter",
	"Game/Core/Protocol/Helper"
],
 
function(Parent, NotificationCenter, ProtocolHelper) {
 
    function User(id, channel) {
    	Parent.call(this, id);

    	this.channel = channel;
        this.player = null;
    	var self = this;

    	NotificationCenter.on('user/joined', function(user) {
    		if(user.id != self.id) {
    			self.sendControlCommand("userJoined", user.id);    			
    		}
    	});

    	NotificationCenter.on('user/' + this.id + "/joinSuccess", function(options) {
    		self.sendControlCommand("joinSuccess", options);
    	});

        NotificationCenter.on('user/' + this.id + "/controlCommand", function(message) { // FIXME: right now only game commands?
            ProtocolHelper.applyCommand(message.data, self);
        });
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.setPlayer = function(player) {
        this.player = player;
    };


    // User command callbacks

    User.prototype.onGameCommand = function(command) {
        this.player.inputController.applyCommand(command);
    };


    // Sending commands

    User.prototype.sendControlCommand = function(command, options) {
    	var recipient = "user/" + this.id;
		var data = ProtocolHelper.encodeCommand(command, options);

    	NotificationCenter.trigger("process/message", recipient, data);
    };

    User.prototype.sendGameCommand = function(command, options) {
    	var data = ProtocolHelper.encodeCommand(command, options);
    	this.sendControlCommand("gameCommand", data);
    };


    return User;
 
});