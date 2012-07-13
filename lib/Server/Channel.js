define(["Chuck/ServerGame"], function(ServerGame) {

	function Channel(name) {
		this.name = name;
		this.users = {};
		this.serverGame = new ServerGame(this);
	}

	Channel.validateName = function(name){
		return true;
	}

	Channel.prototype.addUser = function(user){
		this.users[user.id] = user;
		
		user.sendCommand('joinSuccess', this.name);
		this.sendCommandToAllUsersBut('userJoined', user.id, user);
	}

	Channel.prototype.releaseUser = function(user){
		delete this.users[user.id];
	}

	Channel.prototype.sendCommandToAllUsers = function(command, options) {
		for(var id in this.users) {
			this.users[id].sendCommand(command, options);
		}
	}

	Channel.prototype.sendCommandToAllUsersBut = function(command, options, user) {
		for(var id in this.users) {
			if (id != user.id) {
				this.users[id].sendCommand(command, options);
			}
		}
	}

	return Channel;
	
});