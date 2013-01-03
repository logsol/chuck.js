define([
	"Game/Core/User",
	"Game/Core/NotificationCenter",
	"Game/Core/Protocol/Helper"
],
 
function(Parent, NotificationCenter, ProtocolHelper) {
 
    function User(id, channel) {
    	Parent.call(this, id);

    	this.channel = channel;
    	var self = this;

    	NotificationCenter.on('user/joined', function(user) {
    		self.sendCommand("joined", true);
    	});
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.sendCommand = function(command, options) {
    	var recipient = "user/" + this.id;
		var data = ProtocolHelper.encodeCommand(command, options);

    	NotificationCenter.trigger("net/send", recipient, data);
    };

    return User;
 
});