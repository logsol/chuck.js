define(["Server/User", "Server/Channel", "Server/Factory"], function(User, Channel, Factory) {

	function Coordinator() {
		this.channels = {};
		this.lobbyUsers = {};
	}

	Coordinator.prototype.createUser = function(socketLink){
		var user = new User(socketLink, this);
		this.assignUserToLobby(user);
	}

	Coordinator.prototype.assignUserToLobby = function(user){
		if(user.channel) {
			user.channel.releaseUser(user);
		}
		this.lobbyUsers[user.id] = user;
	}

	Coordinator.prototype.assignUserToChannel = function(user, channelName){

		if(user.channel) {
			user.channel.releaseUser(user);
		}

		if(!Channel.validateName(channelName)){
			//TODO send validation error
			return false;
		}

		var channel = this.channels[channelName];
		if(!channel) {
			var factory = new Factory();
			channel = factory.new(Channel, channelName);
			this.channels[channelName] = channel;
		}

		user.notificationCenter = channel.notificationCenter;
		user.factory = channel.factory;

		channel.addUser(user);
		user.setChannel(channel);

		delete this.lobbyUsers[user.id];
	}

	Coordinator.prototype.removeUser = function(user){
		delete this.lobbyUsers[user.id];
		if(user.channel) {
			user.channel.releaseUser(user);
		}
	}

	return Coordinator;

});