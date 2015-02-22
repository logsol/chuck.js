define([
    "Game/Core/User",
    "Lib/Utilities/Protocol/Helper",
    "Lib/Utilities/NotificationCenter"
],

function (Parent, ProtocolHelper, Nc) {

	"use strict";

    function User (socketLink, coordinator) {
        Parent.call(this, socketLink.id, {});

        this.coordinator = coordinator;
        this.socketLink = socketLink;
        this.channelPipe = null;

        socketLink.on('message', this.onMessage.bind(this));
        socketLink.on('disconnect', this.onDisconnect.bind(this));

        Nc.on(Nc.ns.server.events.controlCommand.user + this.id, this.socketLink.send, this.socketLink);
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.setChannelPipe = function(channelPipe) {
        if(channelPipe) {
            this.channelPipe = channelPipe;
        } else {
            var message = ProtocolHelper.encodeCommand("joinError", {message:"Channel not found"});
            this.socketLink.send(message);
        }
    };
    
    
    // Socket callbacks

    User.prototype.onMessage = function (message) {
        ProtocolHelper.applyCommand(message, this);
    }

    User.prototype.onDisconnect = function () {

        this.coordinator.removeUser(this);

        if(!this.channelPipe) {
            console.warn("Disconnecting user without a channel.");
            return;
        }

        this.channelPipe.send('channel', { releaseUser: this.id });
    }


    // User command callbacks
    // Remember: control commands are coordinator relevant commands

    User.prototype.onJoin = function(options) {
        this.coordinator.assignUserToChannel(this, options.channelName);

        if(!this.channelPipe) {
            console.warn("Can not join user because channel (" + options.channelName + ") does not exist.")
            return;
        }

        var userOptions = {
            id: this.id,
            nickname: options.nickname
        }
        this.channelPipe.send('channel', { addUser: userOptions });
    };

    /* FIXME: watch out and check in wich direction game and control commands flow */
    User.prototype.onGameCommand = function(options) {
        // repacking for transport via pipe
        var message = ProtocolHelper.encodeCommand("gameCommand", options);
        this.channelPipe.sendToUser(this.id, message);
    };

    User.prototype.onPing = function(timestamp) {
        var message = ProtocolHelper.encodeCommand("pong", timestamp);
        Nc.trigger(Nc.ns.server.events.controlCommand.user + this.id, message);
    };

    return User;

});