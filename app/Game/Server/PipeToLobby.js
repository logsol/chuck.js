define([
    "Game/Core/NotficationCenter"
],

function (NotficationCenter) {

    function PipeToLobby (process) {

        this.channel = null;
        this.process = process;

        NotficationCenter.on('net/send', this.send, this);

        process.on('message', function (message, handle) {

            switch(message) {
                case 'CREATE':
                    this.channel = new Channel(this);
                    break;

                case 'KILL':
                    this.channel.destroy();
                    process.exit(0);
                    break;

                default:
                    this.onMessage(message);
                    break;
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
        NotficationCenter.trigger(message.recipient + '/message', message.data);
    }

    return PipeToLobby;

});