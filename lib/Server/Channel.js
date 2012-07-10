define(function() {

	function Channel(name) {
		this.name = name;
		this.users = {};

		// create game here
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

	return Channel;
	
});