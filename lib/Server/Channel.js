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
	}

	Channel.prototype.releaseUser = function(user){
		delete this.users[user.id];
	}

	Channel.prototype.sendToAllUsers = function(package) {
		console.log("not implemented sendToAllUsers: " + JSON.stringify(package))	
	}

	return Channel;
	
});