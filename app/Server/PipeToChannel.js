define([
	"Lib/Utilities/NotificationCenter",
	"child_process"
],

function (Nc, childProcess) {

	"use strict";

	var fork = childProcess.fork;

	function PipeToChannel (options) {

		this.fork = null;

		try {
            this.fork = fork('channel.js'
            /*, { 
            	execArgv: ['--debug=5859'] 
            }*/
            );
        } catch (err) {
            throw 'Failed to fork channel! (' + err + ')';
        }

        console.checkpoint('creating channel process for ' + options.channelName);

        this.send('channel/' + options.channelName, { CREATE: true, options: options });

        this.fork.on('message', this.onMessage.bind(this));

        var self = this;
	}

	// While creating user
	PipeToChannel.prototype.send = function (recipient, data) {
        var message = {
            recipient: recipient,
            data: data
        }

		this.fork.send(message);
	}

	// If user already created
	PipeToChannel.prototype.sendToUser = function (id, data) {
        var message = {
            recipient: id,
            data: data
        }
		
		this.fork.send(message);
	}

	PipeToChannel.prototype.onMessage = function (message) {
		switch(message.recipient) {
			case 'coordinator':
				Nc.trigger(Nc.ns.server.events.controlCommand.coordinator, message.data);
				break;
			default:
				Nc.trigger(Nc.ns.server.events.controlCommand.user + message.recipient, message.data);
				break;
		}
		
	}

	return PipeToChannel;

});