requirejs.config({
    baseUrl: 'app'
});

var inspector = {};

requirejs([
    "Game/Client/Networker", 
    "Lib/Vendor/SocketIO"
], 

function (Networker, SocketIO) {
    
    var options = {
        "reconnect": false,
        "reconnection delay": 500,
        "max reconnection attempts": 10,

        "transports": [
            "websocket", 
            "flashsocket"
        ],
    };

    var socket = SocketIO.connect(location.href, options);
    var networker = new Networker(socket);

    inspector.networker = networker;
});