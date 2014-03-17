    define([
        "Game/Channel/GameController",
        "Lib/Utilities/NotificationCenter",
        "Game/Channel/User",
        "Lib/Utilities/Protocol/Helper",
        "Lib/Utilities/Options",
        "Game/Config/Settings"
    ], 

    function (GameController, Nc, User, ProtocolHelper, Options, Settings) {

        function Channel (pipeToServer, options) {

            var self = this;

            this.options = options = Options.merge(options, {
                levelUids: Settings.DEFAULT_LEVELS
            });
            
            this.name = options.channelName;
            this.users = {};

            this.pipeToServer = pipeToServer;

            this.gameController = new GameController(this);
            
            
            Nc.on(Nc.ns.channel.events.controlCommand.channel, function (message) {
                ProtocolHelper.applyCommand(message.data, self);
            });
            
            
            Nc.on(Nc.ns.channel.to.client.gameCommand.broadcast, this.broadcastGameCommand, this);
            
            // prepared - not triggered yet
            //Nc.on(Nc.ns.channel.to.client.gameCommand.broadcastExcept, this.broadcastGameCommandExcept, this);
            //Nc.on(Nc.ns.channel.to.client.controlCommand.broadcast, this.broadcastControlCommand, this);
            //Nc.on(Nc.ns.channel.to.client.controlCommand.broadcastExcept, this.broadcastControlCommandExcept, this);

            console.checkpoint('channel ' + this.name + ' created');

            setTimeout(function() {
                if(Object.keys(self.users).length < 1) {
                    self.destroy();
                }
            }, Settings.CHANNEL_DESTRUCTION_TIME * 1000);
        }


        // Channel command callbacks

        Channel.prototype.onAddUser = function (options) {
            var self = this;

            if(!this.gameController.level || !this.gameController.level.isLoaded) {
                var token = Nc.on(Nc.ns.core.game.events.level.loaded, function() {
                    self.sendJoinSuccess(options);
                    Nc.off(token);
                });
            } else {
                self.sendJoinSuccess(options);
            }
        }

        Channel.prototype.sendJoinSuccess = function(options) {
            var user = new User(options.id, options);

            var joinedUsers = [];
            for(var userId in this.users) {
                joinedUsers.push(this.users[userId].options)
            }
            
            var levelUid = null;
            if(this.gameController.level) {
                levelUid = this.gameController.level.uid;
            }

            this.users[user.id] = user;

            var options = {
                user: user.options,
                joinedUsers: joinedUsers,
                levelUid: levelUid
            };                 

            //Nc.trigger('user/' + user.id + "/joinSuccess", options);
            user.sendControlCommand("joinSuccess", options);
            Nc.trigger(Nc.ns.channel.events.user.joined, user);

            this.broadcastControlCommandExcept("userJoined", user.options, user);
        };

        Channel.prototype.onReleaseUser = function (userId) {
            var user = this.users[userId];
            Nc.trigger(Nc.ns.channel.events.user.left, userId);
            delete this.users[userId];

            this.broadcastControlCommand("userLeft", userId);
            
            // FIXME: if this was the last user terminate forked process
            if(Object.keys(this.users).length < 1) {
                this.destroy();
            }
        }

        Channel.prototype.destroy = function() {
            console.checkpoint("channel (" + this.name + ") destroyed");
            this.pipeToServer.destroy();
        };


        // Sending commands

        Channel.prototype.broadcastControlCommand = function (command, options) {
            for(var id in this.users) {
                this.users[id].sendControlCommand(command, options);
            }
        }

        Channel.prototype.broadcastControlCommandExcept = function (command, options, exceptUser) {
            for(var id in this.users) {
                if (id != exceptUser.id) {
                    this.users[id].sendControlCommand(command, options);
                }
            }
        }

        Channel.prototype.broadcastGameCommand = function (command, options) {
            for(var id in this.users) {
                this.users[id].sendGameCommand(command, options);
            }
        }

        Channel.prototype.broadcastGameCommandExcept = function (command, options, exceptUser) {
            for(var id in this.users) {
                if (id != exceptUser.id) {
                    this.users[id].sendGameCommand(command, options);
                }
            }
        }

        return Channel;
        
    });