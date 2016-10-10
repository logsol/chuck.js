define([
    "Lib/Utilities/Protocol/Helper", 
    "Game/Client/GameController",
    "Game/Client/User",
    "Lib/Utilities/NotificationCenter",
    "Game/Config/Settings",
    "Game/Client/View/DomController"
], 

function (ProtocolHelper, GameController, User, nc, Settings, domController) {

	"use strict";

    function Networker (socketLink, channelName, nickname) {

        this.channelName = channelName;
        this.nickname = nickname;
        this.socketLink = socketLink;
        this.gameController = null;
        this.users = {};

        this.socketLink.on('connect', this.onConnect.bind(this));
        this.socketLink.on('disconnect', this.onDisconnect.bind(this));

        var self = this;
        this.socketLink.on('message', function (message) {
            var m = JSON.parse(message)

            if(Settings.NETWORK_LOG_INCOMING) {
                var shouldBeFiltered = false;
                var keyword;

                for (var i = 0; i < Settings.NETWORK_LOG_FILTER.length; i++) {
                    keyword = Settings.NETWORK_LOG_FILTER[i];
                    if(message.search(keyword) != -1) {
                        shouldBeFiltered = true;
                        break;
                    }
                };

                if(!shouldBeFiltered) {
                    console.log('INCOMING', message);
                }
            }

            
            ProtocolHelper.applyCommand(message, self);
        });

        nc.on(nc.ns.client.to.server.gameCommand.send, this.sendGameCommand, this);
        nc.on(nc.ns.core.game.events.level.loaded, this.onLevelLoaded, this);

        domController.setNick(nickname);
    }

    // Socket callbacks

    Networker.prototype.onConnect = function () {
        console.log('connected.')
        if(this.channelName) {
            var options = {
                channelName: this.channelName,
                nickname: this.nickname
            }
            this.sendCommand('join', options);
            domController.setConnected(true);
        } else {
            alert("Error: no channel name");
            window.location.href = "/";
        }
    }

    Networker.prototype.onDisconnect = function () {
        //if(this.gameController) this.gameController.destruct();
        //this.gameController = null;
        console.log('disconnected. game destroyed. no auto-reconnect');
        domController.setConnected(false);
    }

    Networker.prototype.onJoinSuccess = function (options) {
        console.log("join success")

        this.onUserJoined(options.user, true);
        this.meUserId = options.user.id;
        
        if (options.joinedUsers) {
            for(var i = 0; i < options.joinedUsers.length; i++) {
                this.onUserJoined(options.joinedUsers[i]);
            }
        }

        this.initPing();
    }

    Networker.prototype.onJoinError = function(options) {
        alert(options.message);
        window.location.href = "/";
    };

    Networker.prototype.onLevelLoaded = function() { 
        /*
        this.gameController.createMe(this.users[this.meUserId]);

        for (var userId in this.users) {
            if(this.meUserId != userId) {
                this.gameController.createPlayer(this.users[userId]);
            }            
        }*/

        this.gameController.onLevelLoaded();

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
            var shouldBeFiltered = false;
            var keyword;

            for (var i = 0; i < Settings.NETWORK_LOG_FILTER.length; i++) {
                keyword = Settings.NETWORK_LOG_FILTER[i];
                if(message.search(keyword) != -1) {
                    shouldBeFiltered = true;
                    break;
                }
            };

            if(!shouldBeFiltered) {
                console.log('OUTGOING', message);
            }
        }
    }

    Networker.prototype.sendGameCommand = function(command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.sendCommand('gameCommand', message);
    }


    // Commands from server

    Networker.prototype.onUserJoined = function (options, isMe) {
        var user = new User(options.id, options);
        console.log(options.nickname)
        this.users[user.id] = user;

        if (!isMe
            && this.gameController 
            && this.gameController.level 
            && this.gameController.level.isLoaded) {

            this.gameController.createPlayer(user);
        }
    }

    Networker.prototype.onUserLeft = function (userId) {
        this.gameController.onUserLeft(userId);
        delete this.users[userId];
    }

    Networker.prototype.onGameCommand = function(message) {
        if (this.gameController) {
            this.gameController.onGameCommand(message);
        } else {
            console.warn("Networker.onGameCommand: this.gameController is undefined", message);
        }
    }

    Networker.prototype.onPong = function(timestamp) {
        var ping = (Date.now() - parseInt(timestamp, 10));
        domController.setPing(ping);
        setTimeout(this.ping.bind(this), 1000);
    };

    Networker.prototype.onBeginRound = function(options) {

        if(this.gameController) {
            this.gameController.destroy();
        }

        this.gameController = new GameController(options);
        
        this.gameController.createMe(this.users[this.meUserId]);

        for (var userId in this.users) {
            if(this.meUserId != userId) {
                this.gameController.createPlayer(this.users[userId]);
            }            
        }

        this.gameController.beginRound();
    };

    Networker.prototype.onEndRound = function() {
        this.gameController.endRound();
    };

    return Networker;
    
});