define([
	"Lobby/User", 
	"Game/Server/Channel",
	"node-fork"
], 

function(User, Channel, nodeFork) {

	var fork = nodeFork.fork;

	function Coordinator() {
		this.channels = {};
		this.lobbyUsers = {};
	}

	Coordinator.prototype.createUser = function(socketLink){
		var user = new User(socketLink, this);
		this.assignUserToLobby(user);
	}

	Coordinator.prototype.assignUserToLobby = function(user){
		if(user.channelProcess) {
			//user.channel.releaseUser(user); -> generate message
		}
		this.lobbyUsers[user.id] = user;
	}

	Coordinator.prototype.assignUserToChannel = function(user, channelName){

		if(user.channelProcess) {
			//user.channel.releaseUser(user); -> generate message
		}

		if(!Channel.validateName(channelName)){
			//TODO send validation error
			return false;
		}

		var channel = this.channels[channelName];
		if(!channel) {

			try {
				console.log('try');
				channel = fork('app/Bootstrap/Channel.js');
				channel.send('CREATE');
				channel.send('{setName:"' + channelName + '"}');
			} catch (err) {
				throw 'Failed to fork channel ' + channelName + '! (' + err + ')';
			}

			this.channels[channelName] = channel;
		}

		//channel.addUser(user);
		//user.setChannel(channel);

		delete this.lobbyUsers[user.id];
	}

	Coordinator.prototype.removeUser = function(user){
		delete this.lobbyUsers[user.id];
		if(user.channelProcess) {
			//user.channel.releaseUser(user); -> generate message
		}
	}

	return Coordinator;

});