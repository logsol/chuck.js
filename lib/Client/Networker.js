define(["Protocol/Helper", "Chuck/ClientGame"], function(ProtocolHelper, ClientGame) {

	function Networker(socketLink) {
		this.socketLink = socketLink;
		this.clientGame = null;

		this.init();
	}

	Networker.prototype.init = function(){
		
		var self = this;

		this.socketLink.on('connect', function(){
			self.onConnect();
		});

		this.socketLink.on('message', function(message){
			self.onMessage(message);
		});

		this.socketLink.on('disconnect', function(){
			self.onDisconnect();
		});
	}

	Networker.prototype.onConnect = function() {
		this.join('dungeon');
	}

	Networker.prototype.onMessage = function(message) {
		var self = this;
		ProtocolHelper.runCommands(message, function(command, options){
			self.processControlCommand(command, options);
		});
	}

	Networker.prototype.onDisconnect = function() {
		this.clientGame.destruct();
		this.clientGame = null;
	}

	Networker.prototype.join = function(channelName){
		this.sendCommand('join', channelName);
	}

	Networker.prototype.sendCommand = function(command, options) {
		var message = ProtocolHelper.encodeCommand(command, options);
		this.socketLink.send(message);
	}

	Networker.prototype.onJoinSuccess = function(channelName) {
		this.clientGame = new ClientGame(this);
		this.clientGame.loadLevel("default.json")
	}

	Networker.prototype.processControlCommand = function(command, options){
		switch(command) {
			case 'joinSuccess':
				this.onJoinSuccess(options);
				break;

			case 'gameCommand':
				this.clientGame.processGameCommand(options);
				break;

			default:	
				break;
		}
	}

	return Networker;
	
});