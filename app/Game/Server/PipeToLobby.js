define([
    "Game/Core/NotificationCenter",
    "Game/Server/Channel"
],

function (NotificationCenter, Channel) {

    function PipeToLobby (process) {

        var self = this;

        this.channel = null;
        this.process = process;

        NotificationCenter.on('net/send', this.send, this);

        process.on('message', function (message, handle) {

            for(var method in message.data) {
                switch(method) {
                    case 'CREATE':
                        self.channel = new Channel(this, message.data[method]);
                        break;

                    case 'KILL':
                        self.channel.destroy();
                        process.exit(0);
                        break;

                    default:
                        self.onMessage(message);
                        break;
                }
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
        NotificationCenter.trigger(message.recipient + '/message', message);
    }

    return PipeToLobby;

});