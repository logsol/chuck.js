define([
    "Server/User", 
    "Server/PipeToChannel",
    "Lib/Utilities/NotificationCenter",
    "Game/Config/Settings"
], 

function (User, PipeToChannel, Nc, Settings) {

	"use strict";

    function Coordinator() {
    	this.channelPipes = {};

        Nc.on(Nc.ns.server.events.controlCommand.coordinator, this.onMessage, this);

        console.checkpoint('create Coordinator');
    }

    Coordinator.prototype.createUser = function (socketLink) {
    	new User(socketLink, this);
    }

    // was assignUserToChannel...
    Coordinator.prototype.getChannelPipeByName = function (channelName) {
    	return this.channelPipes[channelName];
    }

    Coordinator.prototype.onDestroyPipe = function(channelName) {
        delete this.channelPipes[channelName];
    }

    Coordinator.prototype.getChannels = function(options) {
    	var list = [];
        for (var channelName in this.channelPipes) {

            var options = this.channelPipes[channelName].options;

            var playerNames = [];
            var users = this.channelPipes[channelName].getUsers();
            for (var i = 0; i < users.length; i++) {
                playerNames[i] = users[i].options.nickname;
            };
            options.players = playerNames;
            options.playerCount = options.players.length;

            list.push(options);
        }
        return list;
    }

    Coordinator.prototype.createChannel = function(options) {
    	if(this.channelPipes[options.channelName]) {
    		return false;
    	}

    	var channelPipe = new PipeToChannel(options);
    	this.channelPipes[options.channelName] = channelPipe;
    	return {
    		channelName: options.channelName,
    		link: "#" + options.channelName,
            timeout: Settings.CHANNEL_DESTRUCTION_TIME
    	}
    };

    Coordinator.prototype.onMessage = function(message) {
    	if(message.destroy) {
    		delete this.channelPipes[message.destroy];
    	}
    };

 
    return Coordinator;
 
});