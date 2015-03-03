"use strict";

var GLOBALS = { context: "Client" };

requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Client/Extensions'],
    waitSeconds: 0,
    paths: {
        screenfull: "/screenfull",
        chart: "/chart",
        socketio: "/socket.io/socket.io"
    },
});

if(!Chuck) var Chuck = {};
Chuck.inspector = {};

requirejs([
    "Game/Client/Networker", 
    "Lib/Vendor/SocketIO",
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter",
    "Menu/Menu"
], 

function (Networker, SocketIO, Settings, Exception, Nc, Menu) {

    var menu = new Menu();
    menu.onRun = function(channelName, nickname) {
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
        Chuck.inspector.nc = Nc;
        Chuck.inspector.resetLevel = function() { networker.sendGameCommand("resetLevel"); } 
    }
    menu.init();
});