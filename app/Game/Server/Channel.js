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


            
            var self = this;
            NotificationCenter.on("processGameCommandFromUser", function (topic, args) {
                self.processGameCommandFromUser.apply(self, args);
            });
            

            NotificationCenter.on('channel/message', function (message) {
                ProtocolHelper.runCommands(message.data, function (command, options) {
                    self[command].call(self, options);
                });
            });

            NotificationCenter.on('sendControlCommandToAllUsers', this.sendControlCommandToAllUsers, this);
            NotificationCenter.on('channel/users/all/except', this.sendControlCommandToAllUsersExcept, this);

            console.checkpoint('channel ' + name + ' created');
        }

        Channel.validateName = function (name) {
            return true;
        }

        Channel.prototype.addUser = function (userId) {
            var user = new User(userId, this);
            var others = Object.keys(this.users);

            this.users[user.id] = user;
            NotificationCenter.trigger('user/' + user.id + "/joinSuccess", {userId: user.id, channelName: this.name, others: others});
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