"use strict";

Error.stackTraceLimit = Infinity;

requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Client/Extensions'],
    waitSeconds: 0,
    paths: {
        text: 'Lib/Vendor/RequireJs/Plugin/Text',
        json: 'Lib/Vendor/RequireJs/Plugin/Json',
        screenfull: "/screenfull",
        chart: "/chart",
        socketio: "/socket.io/socket.io"
    },
});

var App = App || {};
App.inspector = {};
App.context = "Client";

requirejs([
    "Game/Client/Networker", 
    "Lib/Vendor/SocketIO",
    "Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter",
    "Menu/Menu"
], 

function (Networker, io, Settings, Exception, nc, Menu) {

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
        var socket = io("/", options);
        var networker = new Networker(socket, channelName, nickname);
        App.inspector.networker = networker;
        App.inspector.settings = Settings;
        App.inspector.nc = nc;
        App.inspector.resetLevel = function() { networker.sendGameCommand("resetLevel"); } 
    }
    menu.init();
});
