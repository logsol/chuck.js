define([
    "Lib/Utilities/NotificationCenter",
    "Game/Server/Channel"
],

function (Nc, Channel) {

    function PipeToLobby (process) {

        var self = this;

        this.channel = null;
        this.process = process;

        Nc.on('process/message', this.send, this);

        process.on('message', function (message, handle) {

            if(message.data.hasOwnProperty('CREATE')) {
                self.channel = new Channel(this, message.data['CREATE']);
            } else if (message.data.hasOwnProperty('KILL')) {
                self.channel.destroy();
                process.exit(0);
            } else {
                self.onMessage(message);
            }

        });    
    }

    PipeToLobby.prototype.send = function (recipient, data) {
        var message = {
            recipient: recipient,
            data: data
        }

        this.process.send(message);
    };

    PipeToLobby.prototype.onMessage = function (message) {
        Nc.trigger(message.recipient + '/controlCommand', message);    
    }

    return PipeToLobby;

});