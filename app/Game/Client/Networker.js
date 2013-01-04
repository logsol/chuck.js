define([
    "Game/Core/Protocol/Helper", 
    "Game/Client/GameController",
    "Game/Core/User",
    "Game/Core/NotificationCenter"
], 

function (ProtocolHelper, GameController, User, NotificationCenter) {

    function Networker (socketLink) {
        this.socketLink = socketLink;
        this.gameController = null;

        this.init();
    }

    Networker.prototype.init = function () {
        
        var self = this;

        this.socketLink.on('connect', function () {
            self.onConnect();
        });

        this.socketLink.on('message', function (message) {
            self.onMessage(message);
        });

        this.socketLink.on('disconnect', function () {
            self.onDisconnect();
        });

        NotificationCenter.on("sendGameCommand", this.sendGameCommand, this);
    }

    Networker.prototype.onConnect = function () {
        console.log('connected.')
        this.join('dungeon');
    }

    Networker.prototype.onDisconnect = function () {
        if(this.gameController) this.gameController.destruct();
        this.gameController = null;
        console.log('disconnected. game destroyed. no auto-reconnect');
        document.body.style.backgroundColor = '#aaaaaa';
    }

    Networker.prototype.join = function (channelName) {
        this.sendCommand('join', channelName);
    }


    Networker.prototype.onJoinSuccess = function (options) {
        this.gameController = new GameController();
        this.gameController.loadLevel("default.json");
        

        var user = new User(options.userId);
        this.gameController.meJoined(user);

        console.log("Joined ", options);

        // -> replace with decent command
        if (options.others && options.others.length > 0) {
            for(var i = 0; i < options.others.length; i++) {
                var user = {id: options.others[i]};
                this.gameController.userJoined(user);
            }
        }
    }

    Networker.prototype.sendCommand = function (command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.socketLink.send(message);
    }

    Networker.prototype.sendGameCommand = function(command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.sendCommand('gameCommand', message);
    }

    Networker.prototype.onMessage = function (message) {
        var self = this;

        ProtocolHelper.runCommands(message, function (command, options) {
            self.processControlCommand(command, options);
        });

    }

    Networker.prototype.onUserJoined = function (userId) {
        // -> replace with game command
        var user = {id: userId};
        this.gameController.userJoined(user);
        console.log("User " + userId + " joined");
    }

    Networker.prototype.onUserLeft = function (userId) {
        // -> replace with game command
        var user = {id: userId};
        this.gameController.userLeft(user);
        console.log("User " + userId + " left");
    }

    Networker.prototype.processControlCommand = function (command, options) {

        switch(command) {
            case 'joinSuccess':
                this.onJoinSuccess(options);
                break;

            case 'gameCommand':
                for(var gameCommand in options) {
                    this.gameController.processGameCommand(gameCommand, options[gameCommand]);
                }
                break;

            case 'userJoined':
                this.onUserJoined(options);
                break;

            case 'userLeft':
                this.onUserLeft(options);
                break;

            default:    
                break;
        }
    }

    return Networker;
    
});