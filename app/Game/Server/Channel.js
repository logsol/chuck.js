    define([
        "Game/Server/GameController",
        "Game/Core/NotificationCenter"
    ], 

    function (GameController, NotificationCenter) {

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
            NotificationCenter.on('channel/message', function (message){

                switch(message.recipient) {
                    case 'user':
                        self.forward(self.users[message.id], message.user);
                        break;
                    case 'id': // Do nothing, it is needed by the user
                        break;
                    case 'channel':
                        self.forward(self, message.channel);
                        break;
                    default: 
                        throw 'unknown recipient';
                        break;
                }
            });

            console.checkpoint('channel ' + name + ' created');
        }

        Channel.validateName = function (name) {
            return true;
        }

        Channel.prototype.forward = function (target, message) {
            for(var command in message) {
                if(typeof target[command] == 'function') {
                    target[command].call(target, message[command]);
                } else {
                    throw 'trying to call undefined function ' + target[command];
                }
            }
        };
        
    
        Channel.prototype.addUser = function (user) {
            //var userIds = Object.keys(this.users);
            console.log('addUser', user);
            this.users[user.id] = user;

            //user.sendCommand('joinSuccess', {channelName: this.name, id: user.id, userIds: userIds});
            //this.sendCommandToAllUsersExcept('userJoined', user.id, user);

            //NotificationCenter.trigger('user/joined', user);
        }
/*
        Channel.prototype.releaseUser = function (user) {
            this.gameController.userIdLeft(user.id);

            this.sendCommandToAllUsersExcept("userLeft", user.id, user);
            delete this.users[user.id];
        }

        Channel.prototype.sendCommandToAllUsers = function (command, options) {
            for(var id in this.users) {
                this.users[id].sendCommand(command, options);
            }
        }

        Channel.prototype.sendCommandToAllUsersExcept = function (command, options, except_user) {
            for(var id in this.users) {
                if (id != except_user.id) {
                    this.users[id].sendCommand(command, options);
                }
            }
        }

        Channel.prototype.processGameCommandFromUser = function (command, options, user) {
            this.gameController.progressGameCommandFromUser(command, options, user);
        }
    */
        return Channel;
        
    });