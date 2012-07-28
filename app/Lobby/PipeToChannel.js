define([
	"Game/Core/NotificationCenter"
],

function (NotificationCenter) {

	function PipeToChannel (channelName) {

		this.channelProcess = null;

		try {
            this.channelProcess = fork('channel.js');
        } catch (err) {
            throw 'Failed to fork channel! (' + err + ')';
        }

        this.send('channel/' + channelName, 'CREATE');
        this.channelProcess.on('message', this.onMessage.bind(this));

        var self = this;
	}

	PipeToChannel.prototype.send = function (recipient, data) {
        var message = {
            recipient: recipient,
            data: data
        }

		this.channelProcess.send(message);
	}

	PipeToChannel.prototype.onMessage = function (message) {
		NotficationCenter.trigger(message.recipient + '/message', message.data);
	}

	return PipeToChannel;

});