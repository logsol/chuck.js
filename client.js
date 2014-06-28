GLOBALS = { context: "Client" };

requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions'],
    waitSeconds: 0
});

if(!Chuck) var Chuck = {};
Chuck.inspector = {};

requirejs([
    "Game/Client/Networker", 
    "Lib/Vendor/SocketIO",
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Vendor/Pixi"
], 

function (Networker, SocketIO, Settings, Exception, PIXI) {

    Chuck.run = function(channelName, nickname) {
        var options = {
            "reconnect": false,
            "reconnection delay": 500,
            "max reconnection attempts": 10,
            "transports": [
                "websocket", 
                "flashsocket"
            ]
        };
        var socket = SocketIO.connect("/", options);
        var networker = new Networker(socket, channelName, nickname);
        Chuck.inspector.networker = networker;
        Chuck.inspector.settings = Settings;
        Chuck.inspector.resetLevel = function() { networker.sendGameCommand("resetLevel"); }        
    }
});