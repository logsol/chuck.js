define([
    "Game/Core/User",
    "Lib/Utilities/Protocol/Helper",
    "Lib/Utilities/NotificationCenter"
],

function (Parent, ProtocolHelper, NotificationCenter) {

    function User (socketLink, coordinator) {
        Parent.call(this, socketLink.id);

        this.coordinator = coordinator;
        this.channelProcess = null;
        this.socketLink = socketLink;

        socketLink.on('message', this.onMessage.bind(this));
        socketLink.on('disconnect', this.onDisconnect.bind(this));

        NotificationCenter.on("user/" + this.socketLink.id + "/message", this.socketLink.send, this.socketLink);
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.setChannelProcess = function (channelProcess) {
        this.channelProcess = channelProcess;
    }

    
    // Socket callbacks

    User.prototype.onMessage = function (message) {
        ProtocolHelper.applyCommand(message, this);
    }

    User.prototype.onDisconnect = function () {
        this.coordinator.removeUser(this);
    }


    // User command callbacks
    // Remember: control commands are coordinator relevant commands

    User.prototype.onJoin = function(options) {
        this.coordinator.assignUserToChannel(this, options);
    };

    User.prototype.onLeave = function(options) {
        this.coordinator.assignUserToLobby(this);
    };

    User.prototype.onGameCommand = function(options) {
        // repacking for transport via pipe
        var message = ProtocolHelper.encodeCommand("gameCommand", options);
        NotificationCenter.trigger("user/controlCommand", this.id, message);
    };

    User.prototype.onPing = function(timestamp) {
        var message = ProtocolHelper.encodeCommand("pong", timestamp);
        NotificationCenter.trigger("user/" + this.socketLink.id + "/message", message);
    };

    return User;

});