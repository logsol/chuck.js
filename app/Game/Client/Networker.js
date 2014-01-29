define([
    "Lib/Utilities/Protocol/Helper", 
    "Game/Client/GameController",
    "Game/Client/User",
    "Lib/Utilities/NotificationCenter",
    "Game/Config/Settings",
    "Game/Client/View/DomController"
], 

function (ProtocolHelper, GameController, User, NotificationCenter, Settings, DomController) {

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
            if(Settings.NETWORK_LOG_INCOMING) {
                console.log('INCOMING', message);
            }
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
        this.gameController.loadLevel(options.levelUid);

        this.onUserJoined(options.userId);
        this.gameController.onJoinMe(options.userId);

        if (options.joinedUsers) {
            for(var i = 0; i < options.joinedUsers.length; i++) {
                this.onUserJoined(options.joinedUsers[i]);
            }
        }

        if (options.spawnedPlayers) {
            for(var i = 0; i < options.spawnedPlayers.length; i++) {
                this.gameController.onSpawnPlayer(options.spawnedPlayers[i]);
            }
        }

        if (options.worldUpdate) {
            this.gameController.onWorldUpdate(options.worldUpdate);
        }

        this.initPing();
    }

    Networker.prototype.initPing = function() {

        this.ping();
    };

    Networker.prototype.ping = function() {
        this.sendCommand("ping", Date.now());
    };


    // Sending commands

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

    Networker.prototype.onPong = function(timestamp) {
        var ping = (Date.now() - parseInt(timestamp, 10));
        DomController.setPing(ping);
        setTimeout(this.ping.bind(this), 1000);
    };

    return Networker;
    
});