GLOBALS = { context: "Client" };

requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions'],
    waitSeconds: 0
});

var inspector = {};

requirejs([
    "Game/Client/Networker", 
    "Lib/Vendor/SocketIO",
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Vendor/Pixi"
], 

function (Networker, SocketIO, Settings, Exception, PIXI) {

    var options = {
        "reconnect": false,
        "reconnection delay": 500,
        "max reconnection attempts": 10,
        "transports": [
            "websocket", 
            "flashsocket"
        ]
    };
    var socket = SocketIO.connect(location.href, options);
    var networker = new Networker(socket);
    inspector.networker = networker;
    inspector.settings = Settings;
    inspector.resetLevel = function() { networker.sendGameCommand("resetLevel"); }
});