define([
    "Game/Core/User",
    "Game/Core/Protocol/Helper",
    "Game/Core/NotificationCenter"
], 

function (Parent, ProtocolHelper, NotificationCenter) {

    function User (socketLink, coordinator) {
        Parent.call(this, socketLink.id);
        this.id = socketLink.id;
        this.socketLink = socketLink;
        this.coordinator = coordinator;
        this.channel = null;
        
        this.init(socketLink);
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.init = function (socketLink) {

        var self = this;

    }
/*
    User.prototype.setChannel = function (channel) {
        this.channel = channel;
    }

    User.prototype.sendCommand = function (command, options) {

        var message = ProtocolHelper.encodeCommand(command, options);
        this.socketLink.send(message);
    }



    User.prototype.toString = function () {
        return "[User " + this.id + "]";
    };
*/
    return User;
    
});