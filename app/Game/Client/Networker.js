define([
    "Lib/Utilities/Protocol/Helper", 
    "Game/Client/GameController",
    "Game/Client/User",
    "Lib/Utilities/NotificationCenter",
    "Game/Config/Settings",
    "Game/Client/View/DomController"
], 

function (ProtocolHelper, GameController, User, Nc, Settings, DomController) {

    function Networker (socketLink) {
        this.socketLink = socketLink;
        this.gameController = null;
        this.users = {};
        this.userId = null;

        this.socketLink.on('connect', this.onConnect.bind(this));
        this.socketLink.on('disconnect', this.onDisconnect.bind(this));

        var self = this;
        this.socketLink.on('message', function (message) {
            if(Settings.NETWORK_LOG_INCOMING) {
                console.log('INCOMING', message);
            }
            ProtocolHelper.applyCommand(message, self);
        });

        Nc.on("sendGameCommand", this.sendGameCommand, this);
        Nc.on("game/level/loaded", this.onLevelLoaded, this);
    }

    // Socket callbacks

    Networker.prototype.onConnect = function () {
        console.log('connected.')
        var channel = JSON.parse(localStorage["channel"]);
        if(channel.name) {
            this.sendCommand('join', channel.name);
        } else {
            window.location.href = "/";
        }
    }

    Networker.prototype.onDisconnect = function () {
        if(this.gameController) this.gameController.destruct();
        this.gameController = null;
        console.log('disconnected. game destroyed. no auto-reconnect');
        document.body.style.backgroundColor = '#aaaaaa';
    }

    Networker.prototype.onJoinSuccess = function (options) {
        console.log("join success")
        this.userId = options.userId;

        this.gameController = new GameController();
        this.gameController.loadLevel(options.levelUid);

        this.onUserJoined(options.userId);

        if (options.joinedUsers) {
            for(var i = 0; i < options.joinedUsers.length; i++) {
                this.onUserJoined(options.joinedUsers[i]);
            }
        }

        this.initPing();
    }

    Networker.prototype.onLevelLoaded = function() {  
        for (var userId in this.users) {
            this.gameController.createPlayer(this.users[userId]);
        }

        this.sendGameCommand("clientReady");
    };

    Networker.prototype.initPing = function() {
        this.ping();
    };

    Networker.prototype.ping = function() {
        this.sendCommand("ping", Date.now());
    };


    // Sending commands
    
    // Remember: control commands are coordinator relevant commands
    Networker.prototype.sendCommand = function (command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.socketLink.send(message);
        if(Settings.NETWORK_LOG_OUTGOING) {
            console.log('OUTGOING', message);
        }
    }

    Networker.prototype.sendGameCommand = function(command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.sendCommand('gameCommand', message);
    }


    // Commands from server

    Networker.prototype.onUserJoined = function (userId) {
        var user = new User(userId);
        this.users[userId] = user;

        if (this.gameController 
            && this.gameController.level 
            && this.gameController.level.isLoaded) {

            this.gameController.createPlayer(user);
        };
    }

    Networker.prototype.onUserLeft = function (userId) {
        var user = this.users[userId];
        this.gameController.onUserLeft(user);
        delete this.users[userId];
    }

    Networker.prototype.onGameCommand = function(message) {
        ProtocolHelper.applyCommand(message, this.gameController);
    }

    Networker.prototype.onPong = function(timestamp) {
        var ping = (Date.now() - parseInt(timestamp, 10));
        DomController.setPing(ping);
        setTimeout(this.ping.bind(this), 1000);
    };

    return Networker;
    
});