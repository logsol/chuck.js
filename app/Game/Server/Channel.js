    define([
        "Game/Server/GameController",
        "Game/Core/NotificationCenter"
    ], 

    function (GameController, NotificationCenter) {

        function Channel (pipeToLobby) {

            var self = this;

            this.pipeToLobby = pipeToLobby;

            
            //this.pipeToLobby.receive = function (message) { self.onMessage(message) };
            // !!! This should be done differently - use NotificationCenter.on('channel/dungeon/message') instead

            
            this.users = {};

            this.gameController = new GameController();
            this.gameController.loadLevel("default.json");
            /*
            var self = this;
            NotificationCenter.on("processGameCommandFromUser", function (topic, args) {
                self.processGameCommandFromUser.apply(self, args);
            });
    */
        }

        Channel.validateName = function (name) {
            return true;
        }

        // Messages look like:
        // {channel: {setName: 'foo'}}
        // {user: {jupm: null}, id: 12}
        Channel.prototype.onMessage = function (message) {

            for(var recipient in message) {

                switch(recipient) {

                    case 'user':
                        this.forward(this.users[message.id], message.user);
                        break;
                    case 'id': // Do nothing, it is needed by the user
                        break;
                    case 'channel':
                        this.forward(this, message.channel);
                        break;
                    default: 
                        throw 'unknown recipient';
                        break;
                }
            }
        };

        Channel.prototype.forward = function (target, message) {
            for(var command in message) {
                if(typeof target[command] == 'function') {
                    target[command].call(target, message[command]);
                } else {
                    throw 'trying to call undefined function ' + target[command];
                }
            }
        };

        Channel.prototype.setName = function (name) {
            this.name = name;
            console.log('   created channel ' + name);
        }
        
    /*
        Channel.prototype.addUser = function (user) {
            var userIds = Object.keys(this.users);

            this.users[user.id] = user;

            user.sendCommand('joinSuccess', {channelName: this.name, id: user.id, userIds: userIds});
            this.sendCommandToAllUsersExcept('userJoined', user.id, user);

            NotificationCenter.trigger('user/joined', user);
        }

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