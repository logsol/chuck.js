    define([
        "Game/Server/GameController",
        "Lib/Utilities/NotificationCenter",
        "Game/Server/User",
        "Lib/Utilities/Protocol/Helper"
    ], 

    function (GameController, NotificationCenter, User, ProtocolHelper) {

        function Channel (pipeToLobby, name) {

            var self = this;

            this.name = name;
            this.users = {};

            this.pipeToLobby = pipeToLobby;

            this.gameController = new GameController(this);
            this.gameController.loadLevel("default.json");
            
            NotificationCenter.on('channel/controlCommand', function (message) {
                ProtocolHelper.applyCommand(message.data, self);
            });

            NotificationCenter.on('sendControlCommandToAllUsers', this.sendControlCommandToAllUsers, this);
            NotificationCenter.on('sendControlCommandToAllUsersExcept', this.sendControlCommandToAllUsersExcept, this);

            console.checkpoint('channel ' + name + ' created');
        }

        Channel.validateName = function (name) {
            return true;
        }


        // Channel command callbacks

        Channel.prototype.onAddUser = function (userId) {
            var user = new User(userId, this);
            var joinedUsers = Object.keys(this.users);
            var spawnedPlayers = this.gameController.getSpawnedPlayersAndTheirPositions();
            var worldUpdate = this.gameController.getWorldUpdateObject(true);

            this.users[user.id] = user;

            var options = {
                userId: user.id, 
                channelName: this.name, 
                joinedUsers: joinedUsers,
                spawnedPlayers: spawnedPlayers,
                worldUpdate: worldUpdate

            };
            
            NotificationCenter.trigger('user/' + user.id + "/joinSuccess", options);
            NotificationCenter.trigger('user/joined', user);
        }

        Channel.prototype.onReleaseUser = function (userId) {
            var user = this.users[userId];
            this.sendControlCommandToAllUsersExcept("userLeft", user.id, user);
            NotificationCenter.trigger('user/left', user);
            delete this.users[user.id];
        }


        // Sending commands

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

        return Channel;
        
    });