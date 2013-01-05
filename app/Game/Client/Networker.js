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
        this.users = {};

        this.init();
    }

    Networker.prototype.init = function () {
        
        this.socketLink.on('connect', this.onConnect.bind(this));
        this.socketLink.on('disconnect', this.onDisconnect.bind(this));

        var self = this;
        this.socketLink.on('message', function (message) {
            ProtocolHelper.applyCommand(message, self);
        });

        NotificationCenter.on("sendGameCommand", this.sendGameCommand, this);
    }

    // Socket callbacks

    Networker.prototype.onConnect = function () {
        console.log('connected.')
        this.sendCommand('join', 'dungeon');
    }

    Networker.prototype.onDisconnect = function () {
        if(this.gameController) this.gameController.destruct();
        this.gameController = null;
        console.log('disconnected. game destroyed. no auto-reconnect');
        document.body.style.backgroundColor = '#aaaaaa';
    }

    Networker.prototype.onJoinSuccess = function (options) {
        this.gameController = new GameController();
        this.gameController.loadLevel("default.json");

        this.onUserJoined(options.userId);
        this.gameController.onJoinMe(options.userId);

        if (options.others) {
            for(var i = 0; i < options.others.length; i++) {
                this.onUserJoined(options.others[i]);
            }
        }
    }

    // Sending commands

    Networker.prototype.sendCommand = function (command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.socketLink.send(message);
    }

    Networker.prototype.sendGameCommand = function(command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.sendCommand('gameCommand', message);
    }

    // Commands from server

    Networker.prototype.onUserJoined = function (userId) {
        var user = new User(userId);
        this.users[userId] = user;
        this.gameController.userJoined(user);
    }

    Networker.prototype.onUserLeft = function (userId) {
        var user = this.users[userId];
        this.gameController.userLeft(user);
        delete this.users[userId];
    }

    Networker.prototype.onGameCommand = function(message) {
        ProtocolHelper.applyCommand(message, this.gameController);
    }

    return Networker;
    
});