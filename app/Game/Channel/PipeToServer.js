define([
    "Lib/Utilities/NotificationCenter",
    "Game/Channel/Channel"
],

function (Nc, Channel) {

    function PipeToServer (process) {

        var self = this;

        this.channel = null;
        this.process = process;

        Nc.on(Nc.ns.channel.to.server.controlCommand.send, this.send, this);

        process.on('message', function (message, handle) {

            if(message.data.hasOwnProperty('CREATE')) {
                self.channel = new Channel(self, message.data.options);
            } else if (message.data.hasOwnProperty('KILL')) {
                self.channel.destroy();
            } else {
                self.onMessage(message);
            }

        });    
    }

    PipeToServer.prototype.send = function (recipient, data) {
        var message = {
            recipient: recipient,
            data: data
        }

        this.process.send(message);
    };

    PipeToServer.prototype.onMessage = function (message) {
        switch(message.recipient) {
            case 'channel':
                Nc.trigger(Nc.ns.channel.events.controlCommand.channel, message);    
                break;
            default: 
                Nc.trigger(Nc.ns.channel.events.controlCommand.user + message.recipient, message);    
                break;
        }
        
    }

    PipeToServer.prototype.destroy = function() {
        this.send('coordinator', {destroy:this.channel.name});
        this.process.exit(0);
    };

    return PipeToServer;

});