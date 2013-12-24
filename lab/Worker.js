define([
	"Game/Client/Networker",
    "Game/Core/Protocol/Helper", 
    "Game/Client/GameController",
    "Game/Client/User",
    "Game/Core/NotificationCenter"
], 

function (Parent, ProtocolHelper, GameController, User, NotificationCenter) {

    function Worker () {
        //this.socketLink = socketLink;
        this.gameController = null;
        this.users = {};

        this.init();
    }

    Worker.prototype = Object.create(Parent.prototype);

    Worker.prototype.init = function () {
        
        
        ProtocolHelper.applyCommand({
        	"joinSuccess":{
        		"userId":"k31HvnDM7Jy6mfmKOe3y",
        		"channelName":"dungeon",
        		"joinedUsers":[],
        		"spawnedPlayers":[]
        	}
        }, this);

       ProtocolHelper.applyCommand({
			"gameCommand":{
				"spawnPlayer":{
					"id":"k31HvnDM7Jy6mfmKOe3y",
					"x":150,
					"y":50
				}
			}
		}, this);

       NotificationCenter.on("sendGameCommand", this.sendGameCommand, this);
    }

    Worker.prototype.sendCommand = function (command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        //this.socketLink.send(message);
    }

    return Worker;
    
});