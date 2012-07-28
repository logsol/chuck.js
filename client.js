requirejs.config({
    baseUrl: 'app'
});

var inspector = {};

requirejs(["Bootstrap/Client"], function(Client) {
    
    var options = {
        "reconnect": false,
        "reconnection delay": 500,
        "max reconnection attempts": 10,

        "transports": [
            "websocket", 
            "flashsocket"
        ],
    };

    var client = new Client(location.href, options);
    inspector.client = client;
});