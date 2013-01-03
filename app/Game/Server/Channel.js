    define([
        "Game/Server/GameController",
        "Game/Core/NotificationCenter",
        "Game/Server/User",
        "Game/Core/Protocol/Helper"
    ], 

    function (GameController, NotificationCenter, User, ProtocolHelper) {

        function Channel (pipeToLobby, name) {

            var self = this;

            this.name = name;
            this.users = {};

            this.pipeToLobby = pipeToLobby;
            this.gameController = new GameController(this);
            
            this.gameController.loadLevel("default.json");

            //this.pipeToLobby.receive = function (message) { self.onMessage(message) };
            // !!! This should be done differently - use NotificationCenter.on('channel/dungeon/message') instead

            /*
            var self = this;
            NotificationCenter.on("processGameCommandFromUser", function (topic, args) {
                self.processGameCommandFromUser.apply(self, args);
            });


    */

            // Messages look like:
            // {channel: {setName: 'foo'}}
            // {user: {jupm: null}, id: 12}
            NotificationCenter.on('channel/message', function (message) {

                switch(message.recipient) {
                    case 'user':
                        console.log(message);
                        var user = self.users[message.id];
                        ProtocolHelper.runCommands(message.data, function (command, options) {
                            user[command].call(user, options);
                        });
                        break;

                    case 'id': // Do nothing, it is needed by the user
                        break;

                    case 'channel':
                        ProtocolHelper.runCommands(message.data, function (command, options) {
                            self[command].call(self, options);
                        });
                        break;

                    default: 
                        throw 'unknown recipient';
                        break;
                }
            });

            NotificationCenter.on('channel/users/all', this.sendControlCommandToAllUsers, this);
            NotificationCenter.on('channel/users/all/except', this.sendControlCommandToAllUsersExcept, this);

            console.checkpoint('channel ' + name + ' created');
        }

        Channel.validateName = function (name) {
            return true;
        }

        Channel.prototype.addUser = function (userId) {
            var user = new User(userId, this);
            this.users[user.id] = user;
            NotificationCenter.trigger('user/' + user.id + "/joinSuccess", {userId: user.id, channelName: this.name});
            NotificationCenter.trigger('user/joined', user);
        }


        Channel.prototype.releaseUser = function (userId) {
            var user = this.users[userId];
            //this.gameController.userIdLeft(user.id);

            this.sendControlCommandToAllUsersExcept("userLeft", user.id, user);
            delete this.users[user.id];
        }

        Channel.prototype.sendControlCommandToAllUsers = function (command, options) {
            for(var id in this.users) {
                this.users[id].sendControlCommand(command, options);
            }
        }

        Channel.prototype.sendControlCommandToAllUsersExcept = function (command, options, exceptUser) {
            for(var id in this.users) {
                if (id != exceptUser.id) {
                    this.users[id].sendControlCommand(command, options);
                }
            }
        }
/*
        Channel.prototype.processGameCommandFromUser = function (command, options, user) {
            this.gameController.progressGameCommandFromUser(command, options, user);
        }
    */
        return Channel;
        
    });