    define([
        "Game/Server/GameController",
        "Lib/Utilities/NotificationCenter",
        "Game/Server/User",
        "Lib/Utilities/Protocol/Helper",
        "Lib/Utilities/Options",
        "Game/Config/Settings"
    ], 

    function (GameController, NotificationCenter, User, ProtocolHelper, Options, Settings) {

        function Channel (pipeToLobby, name, options) {

            var self = this;

            this.options = options = Options.merge(options, {
                levelUids: Settings.DEFAULT_LEVELS
            });
            
            this.name = name;
            this.users = {};

            this.pipeToLobby = pipeToLobby;

            this.gameController = new GameController(this);
            
            NotificationCenter.on('channel/controlCommand', function (message) {
                ProtocolHelper.applyCommand(message.data, self);
            });

            NotificationCenter.on('broadcastControlCommand', this.broadcastControlCommand, this);
            NotificationCenter.on('broadcastControlCommandExcept', this.broadcastControlCommandExcept, this);

            NotificationCenter.on('broadcastGameCommand', this.broadcastGameCommand, this);
            NotificationCenter.on('broadcastGameCommandExcept', this.broadcastGameCommandExcept, this);

            console.checkpoint('channel ' + name + ' created');
        }

        Channel.validateName = function (name) {
            return true;
        }


        // Channel command callbacks

        Channel.prototype.onAddUser = function (userId) {
            var self = this;

            if(!this.gameController.level || !this.gameController.level.isLoaded) {
                var token = NotificationCenter.on("game/level/loaded", function() {
                    self.sendJoinSuccess(userId);
                    NotificationCenter.off(token);
                });
            } else {
                self.sendJoinSuccess(userId);
            }
        }

        Channel.prototype.sendJoinSuccess = function(userId) {
            var user = new User(userId, this);
            var joinedUsers = Object.keys(this.users);
            
            var levelUid = null;
            if(this.gameController.level) {
                levelUid = this.gameController.level.uid;
            }

            this.users[user.id] = user;

            var options = {
                userId: user.id, 
                channelName: this.name, 
                joinedUsers: joinedUsers,
                levelUid: levelUid
            };                 

            NotificationCenter.trigger('user/' + user.id + "/joinSuccess", options);
            NotificationCenter.trigger('user/joined', user);  
        };

        Channel.prototype.onReleaseUser = function (userId) {
            var user = this.users[userId];
            this.broadcastControlCommandExcept("userLeft", user.id, user);
            NotificationCenter.trigger('user/left', user);
            delete this.users[user.id];
        }


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