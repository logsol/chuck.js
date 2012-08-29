define([
    "Lobby/User", 
    "Game/Server/Channel",
    "Lobby/PipeToChannel",
    "Game/Core/NotificationCenter"
], 

function (User, Channel, PipeToChannel, NotificationCenter) {

    function Coordinator () {
        this.channels = {};
        this.lobbyUsers = {};
    }

    Coordinator.prototype.createUser = function (socketLink) {
        var user = new User(socketLink, this);
        this.assignUserToLobby(user);
    }

    Coordinator.prototype.assignUserToLobby = function (user) {
        if(user.channelProcess) {
            //user.channel.releaseUser(user); -> generate message
        }
        this.lobbyUsers[user.id] = user;
    }

    Coordinator.prototype.assignUserToChannel = function (user, channelName) {

        if(user.channelProcess) {
            //user.channel.releaseUser(user); -> generate message
        }

        if(!Channel.validateName(channelName)) {
            //TODO send validation error
            return false;
        }

        var channel = this.channels[channelName];
        if(!channel) {
            channel = new PipeToChannel(channelName);
            this.channels[channelName] = channel;

            NotificationCenter.on('channel/' + channelName + '/message', function (data) {
                channel.send('channel', data);
            }, this);

            NotificationCenter.on('user/joined', function (user) {
                NotificationCenter.on('channel/' + channelName + '/user/' + user.id, function (recipient, data) {
                    channel.send(recipient, data);
                }, this);
            }, this);

            NotificationCenter.on('user/left', function (user) {
                
            }, this);
        }

        //channel.addUser(user);
        //user.setChannel(channel);

        delete this.lobbyUsers[user.id];
    }

    Coordinator.prototype.removeUser = function (user) {

        user.channel.send('user/' + user.id + '/left');
        NotificationCenter.off('channel/' + user.channel.channelName + '/user/' + user.id);

        delete this.lobbyUsers[user.id];
    }

    return Coordinator;

});