define([
    'socket.io'
], 

function (io) {

    "use strict";

    function Socket (server, options, coordinator) {
        this.coordinator = coordinator;
        this.io = io(server, {
            // No more 'log level' or 'transports' in v4
            // Add any v4-compatible options here if needed
        });
        this.init(options);
    }

    Socket.prototype.init = function (options) {
        var self = this;
        this.io.on('connection', function (socket) {
            console.checkpoint('socket receiving connection');
            self.onConnection(socket);
        });
        console.checkpoint('start Socket Listener');
    }

    Socket.prototype.onConnection = function (socketLink) {
        this.coordinator.createUser(socketLink);
    }

    return Socket;
    
});
