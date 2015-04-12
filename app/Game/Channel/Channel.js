    define([
        "Game/Channel/GameController",
        "Lib/Utilities/NotificationCenter",
        "Game/Channel/User",
        "Lib/Utilities/Protocol/Helper",
        "Lib/Utilities/Options",
        "Game/Config/Settings"
    ], 

    function (GameController, Nc, User, ProtocolHelper, Options, Settings) {

        "use strict";

        function Channel (pipeToServer, options) {

            var self = this;

            this.name = options.channelName;
            this.users = {};
            this.pipeToServer = pipeToServer;
            this.levelListIndex = -1;
            this.gameController = null;

            this.options = options = Options.merge(options, {
                levelUids: Settings.CHANNEL_DEFAULT_LEVELS
            });

            // Notification Center
            Nc.on(Nc.ns.channel.events.round.end, this.onEndRound, this);
            Nc.on(Nc.ns.channel.events.controlCommand.channel, function (message) {
                ProtocolHelper.applyCommand(message.data, self);
            });
            Nc.on(Nc.ns.channel.to.client.gameCommand.broadcast, this.broadcastGameCommand, this);
            Nc.on(Nc.ns.channel.to.client.controlCommand.broadcast, this.broadcastControlCommand, this);
            //Nc.on(Nc.ns.channel.to.client.gameCommand.broadcastExcept, this.broadcastGameCommandExcept, this);
            //Nc.on(Nc.ns.channel.to.client.controlCommand.broadcastExcept, this.broadcastControlCommandExcept, this);

            this.beginRound();

            console.checkpoint("channel " + this.name + " created");

            setTimeout(function() {
                if(Object.keys(self.users).length < 1) {
                    self.destroy();
                }
            }, Settings.CHANNEL_DESTRUCTION_TIME * 1000);
        }

        Channel.prototype.getNextLevelUid = function() {
            this.levelListIndex = (this.levelListIndex + 1) % this.options.levelUids.length;
            return this.options.levelUids[this.levelListIndex];
        };


        Channel.prototype.beginRound = function() {

            if(this.gameController) {
                this.gameController.destroy();
                this.gameController = null;
            }

            var gameControllerOptions = {
                channelName: this.name,
                scoreLimit: this.options.scoreLimit,
                levelUid: this.getNextLevelUid()
            };

            console.checkpoint("Begin Round (" + this.name + ")");

            this.gameController = new GameController(gameControllerOptions);

            for(var userId in this.users) {
                this.gameController.createPlayer(this.users[userId]);
            }

            var clientGameControllerOptions = {
                levelUid: gameControllerOptions.levelUid
            };

            console.log("beginRound")
            this.broadcastControlCommand("beginRound", clientGameControllerOptions);
        };

        Channel.prototype.onEndRound = function() {
            var self = this;
            this.broadcastControlCommand("endRound", true);

            console.checkpoint("End Round (" + this.name + ") - Begin Round in " + Settings.CHANNEL_END_ROUND_TIME + " seconds");
            
            setTimeout(function() {
                self.beginRound();
            }, Settings.CHANNEL_END_ROUND_TIME * 1000);
        };


        // Channel command callbacks

        Channel.prototype.onAddUser = function (options) {
            var self = this;

            var clientGameControllerOptions = {
                levelUid: this.gameController.options.levelUid
            };

            if(!this.gameController.level || !this.gameController.level.isLoaded) {
                var token = Nc.on(Nc.ns.core.game.events.level.loaded, function() {
                    self.sendJoinSuccess(options);
                    self.users[options.id].sendControlCommand("beginRound", clientGameControllerOptions);
                    Nc.off(token);
                });
            } else {
                this.sendJoinSuccess(options);
                this.users[options.id].sendControlCommand("beginRound", clientGameControllerOptions);
            }
        };

        Channel.prototype.sendJoinSuccess = function(options) {
            var user = new User(options.id, options);

            var joinedUsers = [];
            for(var userId in this.users) {
                joinedUsers.push(this.users[userId].options);
            }
            
            var levelUid = null;
            if(this.gameController.level) {
                levelUid = this.gameController.level.uid;
            }

            this.users[user.id] = user;

            options = {
                user: user.options,
                joinedUsers: joinedUsers,
                levelUid: levelUid
            };                 

            //Nc.trigger("user/" + user.id + "/joinSuccess", options);
            user.sendControlCommand("joinSuccess", options);
            Nc.trigger(Nc.ns.channel.events.user.joined, user);

            this.broadcastControlCommandExcept("userJoined", user.options, user);
        };

        Channel.prototype.onReleaseUser = function (userId) {
            var self = this;
            Nc.trigger(Nc.ns.channel.events.user.left, userId);
            delete this.users[userId];

            this.broadcastControlCommand("userLeft", userId);
            
            if(Object.keys(this.users).length < 1) {

                console.checkpoint("channel (" + this.name + ") destruction scheduled. t - " + Settings.CHANNEL_DESTRUCTION_TIME + " seconds");

                setTimeout(function() {
                    if(Object.keys(self.users).length < 1) {
                        self.destroy();
                    } else {
                        console.checkpoint("channel (" + self.name + ") destruction aborted (a user joined).");
                    }
                }, Settings.CHANNEL_DESTRUCTION_TIME * 1000);
            }
        };

        Channel.prototype.destroy = function() {
            console.checkpoint("channel (" + this.name + ") destroyed");
            this.pipeToServer.destroy();
        };


        // Sending commands

        Channel.prototype.broadcastControlCommand = function (command, options) {
            for(var id in this.users) {
                this.users[id].sendControlCommand(command, options);
            }
        };

        Channel.prototype.broadcastControlCommandExcept = function (command, options, exceptUser) {
            for(var id in this.users) {
                if (id != exceptUser.id) {
                    this.users[id].sendControlCommand(command, options);
                }
            }
        };

        Channel.prototype.broadcastGameCommand = function (command, options) {
            for(var id in this.users) {
                this.users[id].sendGameCommand(command, options);
            }
        };

        Channel.prototype.broadcastGameCommandExcept = function (command, options, exceptUser) {
            for(var id in this.users) {
                if (id != exceptUser.id) {
                    this.users[id].sendGameCommand(command, options);
                }
            }
        };

        return Channel;
        
    });