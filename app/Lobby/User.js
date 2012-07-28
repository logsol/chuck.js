define([
    "Game/Core/User",
    "Game/Core/Protocol/Helper"
],

function(Parent, ProtocolHelper) {

    function User(socketLink, coordinator) {
        Parent.call(this, socketLink.id);

        this.coordinator = coordinator;
        this.channelProcess = null;

        var self = this;

        socketLink.on('message', function(message){
            self.onMessage(message);
        });
        socketLink.on('disconnect', function(){
            self.onDisconnect();
        });
    }

    User.prototype = Object.create(Parent.prototype);

    User.prototype.setChannelProcess = function(channelProcess) {
        this.channelProcess = channelProcess;
    }

    User.prototype.onMessage = function(message){
        var self = this;
        ProtocolHelper.runCommands(message, function(command, options){
            self.processControlCommand(command, options);
        });
    }

    User.prototype.onDisconnect = function(){
        this.coordinator.removeUser(this);
    }

    User.prototype.processControlCommand = function(command, options){
        switch(command) {

            case 'join':
                this.coordinator.assignUserToChannel(this, options);
                break;

            case 'leave':
                this.coordinator.assignUserToLobby(this);
                break;

            case 'gameCommand':
                for(var gameCommand in options) {
                    //NotificationCenter.trigger("processGameCommandFromUser", [gameCommand, options[gameCommand], this]);
                    //this.channel.processGameCommandFromUser(gameCommand, options[gameCommand], this);
                }
                break;

            default: 
                break;
        }
    }

    return User;

});