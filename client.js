requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
});

var inspector = {};

requirejs([
    "Game/Client/Networker", 
    "Lib/Vendor/SocketIO",
    "Game/Config/Settings"
], 

function (Networker, SocketIO, Settings) {
    
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
    inspector.settings = Settings;
});