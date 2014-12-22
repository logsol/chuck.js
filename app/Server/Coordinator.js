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

    Coordinator.prototype.assignUserToChannel = function (user, channelName) {
    	var channelPipe = this.channelPipes[channelName];
    	user.setChannelPipe(channelPipe);
    }

    Coordinator.prototype.onDestroyPipe = function(channelName) {
        delete this.channelPipes[channelName];
    }

    Coordinator.prototype.getChannels = function(options) {
    	var list = [];
        for (var channelName in this.channelPipes) {
            list.push({
                name: channelName
            });
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