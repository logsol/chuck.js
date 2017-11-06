define([
    'socket.io'
], 

function (io) {

	"use strict";

    function Socket (server, options, coordinator) {
        options.logLevel = typeof options.logLevel != 'undefined'
            ? options.logLevel
            : 0;
        
        this.coordinator = coordinator;
        this.socket = io(server, {
            'log level': options.logLevel,
            //'transports': ['websockets']
        });

        this.init(options);
    }

    Socket.prototype.init = function (options) {

        var self = this;
        this.socket.on('connection', function (user) {
            console.checkpoint('socket receiving connection');
            self.onConnection(user);
        });

        console.checkpoint('start Socket Listener');
    }

    Socket.prototype.onConnection = function (socketLink) {
        this.coordinator.createUser(socketLink);
    }

    return Socket;
    
});
