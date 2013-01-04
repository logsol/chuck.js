define([
    "Game/Core/User",
    "Game/Core/Protocol/Helper",
    "Game/Core/NotificationCenter"
],

function (Parent, ProtocolHelper, NotificationCenter) {

    function User (socketLink, coordinator) {
        Parent.call(this, socketLink.id);

        this.coordinator = coordinator;
        this.channelProcess = null;
        this.socketLink = socketLink;

        var self = this;

        socketLink.on('message', function (message) {
            self.onMessage(message);
        });
        socketLink.on('disconnect', function () {
            self.onDisconnect();
        });

        NotificationCenter.on("user/" + this.socketLink.id + "/message", this.onChannelMessage, this);
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.setChannelProcess = function (channelProcess) {
        this.channelProcess = channelProcess;
    }

    User.prototype.onMessage = function (message) {
        var self = this;
        ProtocolHelper.runCommands(message, function (command, options) {
            self.processControlCommand(command, options);
        });
    }

    User.prototype.onDisconnect = function () {
        this.coordinator.removeUser(this);
    }

    User.prototype.processControlCommand = function (command, options) {
        switch(command) {

            case 'join':
                this.coordinator.assignUserToChannel(this, options);
                break;

            case 'leave':
                this.coordinator.assignUserToLobby(this);
                break;

            case 'gameCommand':
                NotificationCenter.trigger("user/gameCommand", this.id, options);
                break;

            default: 
                break;
        }
    }

    User.prototype.onChannelMessage = function(message) {
        this.socketLink.send(message);
    };

    return User;

});