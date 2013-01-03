define([
    "Lobby/User", 
    "Game/Server/Channel",
    "Lobby/PipeToChannel",
    "Game/Core/NotificationCenter"
], 

function (User, Channel, PipeToChannel, NotificationCenter) {

    function Coordinator () {
        this.channelPipes = {};
        this.lobbyUsers = {};

        console.checkpoint('create Coordinator');
    }

    Coordinator.prototype.createUser = function (socketLink) {
        var user = new User(socketLink, this);
        console.checkpoint('creating user');
        this.assignUserToLobby(user);
    }

    Coordinator.prototype.assignUserToLobby = function (user) {
        if(user.channelPipe) {
            //user.channel.releaseUser(user); -> generate message
        }
        this.lobbyUsers[user.id] = user;
        console.checkpoint('assign user to lobby');
    }

    Coordinator.prototype.assignUserToChannel = function (user, channelName) {

        if(user.channelPipe) {
            //user.channel.releaseUser(user); -> generate message
        }

        if(!Channel.validateName(channelName)) {
            //TODO send validation error
            return false;
        }

        var channelPipe = this.channelPipes[channelName];
        if(!channelPipe) {
            this.createPipe(channelName);
        }

        //channel.addUser(user);
        //user.setChannel(channel);
        NotificationCenter.trigger('user/joined', user);

        delete this.lobbyUsers[user.id];
    }

    Coordinator.prototype.removeUser = function (user) {

        NotificationCenter.trigger('user/left', user);
        //NotificationCenter.off('channel/' + user.channel.channelName + '/user/' + user.id);

        delete this.lobbyUsers[user.id];
    }

    Coordinator.prototype.createPipe = function(channelName) {

        var channelPipe = new PipeToChannel(channelName);
        this.channelPipes[channelName] = channelPipe;

        
        NotificationCenter.on('channel/' + channelName + '/message', function (data) {
            channelPipe.send('channel', data);
        }, this);

        // sending info to user
        NotificationCenter.on('user/joined', function (user) {
            /*
            NotificationCenter.on('channel/' + channelName + '/user/' + user.id, function (recipient, data) {
                channelPipe.send(recipient, data);
            }, this);
            */

            channelPipe.send('channel', { addUser: user.id });

        }, this);

        NotificationCenter.on('user/left', function (user) {
            channelPipe.send('channel', { releaseUser: user.id });
        }, this);
        
        return channelPipe;
    };

    return Coordinator;

});