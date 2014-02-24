define([
	"Lib/Utilities/NotificationCenter",
	"child_process"
],

function (NotificationCenter, childProcess) {

	var fork = childProcess.fork;

	function PipeToChannel (channelName) {

		this.channelPipe = null;

		try {
            this.channelPipe = fork('channel.js');
            console.log(this.channelPipe)
        } catch (err) {
            throw 'Failed to fork channel! (' + err + ')';
        }

        console.checkpoint('creating channel process for ' + channelName);

        this.send('channel/' + channelName, { CREATE: channelName });

        this.channelPipe.on('message', this.onMessage.bind(this));

        var self = this;
	}

	// While creating user
	PipeToChannel.prototype.send = function (recipient, data) {
        var message = {
            recipient: recipient,
            data: data
        }

		this.channelPipe.send(message);
	}

	// If user already created
	PipeToChannel.prototype.sendToUser = function (id, data) {
        var message = {
            recipient: "user/" + id,
            data: data
        }
		
		this.channelPipe.send(message);
	}

	PipeToChannel.prototype.onMessage = function (message) {
		NotificationCenter.trigger(message.recipient + '/message', message.data);
	}

	return PipeToChannel;

});