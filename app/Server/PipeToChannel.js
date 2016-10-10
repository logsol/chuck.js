define([
	"Lib/Utilities/NotificationCenter",
	"child_process"
],

function (nc, childProcess) {

	"use strict";

	function PipeToChannel (options) {

		this.fork = null;
		this.options = options;
		this.users = [];

		try {
            this.fork = childProcess.fork('channel.js'
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

	PipeToChannel.prototype.isFull = function() {
		return this.users.length >= this.options.maxUsers;
	};

	PipeToChannel.prototype.onMessage = function (message) {
		switch(message.recipient) {
			case 'coordinator':
				nc.trigger(nc.ns.server.events.controlCommand.coordinator, message.data);
				break;
			default:
				nc.trigger(nc.ns.server.events.controlCommand.user + message.recipient, message.data);
				break;
		}
		
	}

	PipeToChannel.prototype.addUser = function(user) {
		this.users.push(user);
		this.send('channel', { addUser: user.options });
	};

	PipeToChannel.prototype.removeUser = function(user) {
        for(var i = 0; i < this.users.length; i++) {
            if(this.users[i] === user) {
                this.users.splice(i, 1);
                break;
            }
        }

        this.send('channel', { releaseUser: user.id });
	};

	PipeToChannel.prototype.getUsers = function() {
		return this.users;
	};

	return PipeToChannel;

});