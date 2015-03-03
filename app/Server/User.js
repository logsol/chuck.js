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
        this.options = null;

        socketLink.on('message', this.onMessage.bind(this));
        socketLink.on('disconnect', this.onDisconnect.bind(this));

        Nc.on(Nc.ns.server.events.controlCommand.user + this.id, this.socketLink.send, this.socketLink);
    }

    User.prototype = Object.create(Parent.prototype);

/*
    User.prototype.setChannelPipe = function(channelPipe) {
        if(channelPipe) {
            if (channelPipe.isWithinUserLimit()) {
                this.channelPipe = channelPipe;
                this.channelPipe.addUser(this);
            } else {
                var message = ProtocolHelper.encodeCommand("joinError", {message:"Channel is full"});
                this.socketLink.send(message);
            }
            
        } else {
            var message = ProtocolHelper.encodeCommand("joinError", {message:"Channel not found"});
            this.socketLink.send(message);
        }
    };
    */
    
    // Socket callbacks

    User.prototype.onMessage = function (message) {
        ProtocolHelper.applyCommand(message, this);
    }

    User.prototype.onDisconnect = function () {

        if(!this.channelPipe) {
            console.warn("Disconnecting user without a channel. (Maybe channel was full)");
            return;
        }

        this.channelPipe.removeUser(this);
    }


    // User command callbacks
    // Remember: control commands are coordinator relevant commands

    User.prototype.onJoin = function(options) {

        var channelPipe = this.coordinator.getChannelPipeByName(options.channelName);

        if(!channelPipe) {
            var message = ProtocolHelper.encodeCommand("joinError", {message:"Channel " + options.channelName + " not found."});
            this.socketLink.send(message);
            return;
        }

        if (channelPipe.isFull()) {
            var message = ProtocolHelper.encodeCommand("joinError", {message:"Sorry! Channel " + options.channelName + " is full."});
            this.socketLink.send(message);
            return;
        }

        this.channelPipe = channelPipe;

        var userOptions = {
            id: this.id,
            nickname: options.nickname
        }
        this.options = userOptions;
        this.channelPipe.addUser(this);
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