define(["Chuck/ServerGame"], function(ServerGame) {

	function Channel(name) {
		this.name = name;
		this.users = {};
		this.serverGame = new ServerGame(this);
		this.serverGame.loadLevel("default.json")
	}

	Channel.validateName = function(name){
		return true;
	}

	Channel.prototype.addUser = function(user){
		var userIds = Object.keys(this.users);

		this.users[user.id] = user;
		
		user.sendCommand('joinSuccess', {channelName: this.name, id: user.id, userIds: userIds});
		this.sendCommandToAllUsersExcept('userJoined', user.id, user);

		this.serverGame.createPlayerForUser(user)
	}

	Channel.prototype.releaseUser = function(user){
		delete this.users[user.id];
	}

	Channel.prototype.sendCommandToAllUsers = function(command, options) {
		for(var id in this.users) {
			this.users[id].sendCommand(command, options);
		}
	}

	Channel.prototype.sendCommandToAllUsersExcept = function(command, options, except_user) {
		for(var id in this.users) {
			if (id != except_user.id) {
				this.users[id].sendCommand(command, options);
			}
		}
	}

	Channel.prototype.processGameCommandFromUser = function(command, options, user) {
		this.serverGame.progressGameCommandFromUser(command, options, user);
	}

	return Channel;
	
});