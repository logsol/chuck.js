GLOBALS = { context: "Client" };

requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
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

    function loadAssets(callback) {
        var url = "static/img/paths.txt";
        var loaded = document.getElementById("loaded");
        var loading = document.getElementById("loading");
        var count = 0;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    var paths = xhr.responseText.split("\n");
                    var max = paths.length;
                    loader = new PIXI.AssetLoader(paths);
                    loader.onComplete = function() { loading.style.display = "none"; callback(); };
                    loader.onProgress = function() { loaded.style.width = (100 / max * ++count) + "%"; }
                    loader.load();
                } else {
                    throw new Exception("Assets preloader error: " + xhr.status + " " + xhr.statusText)
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send(null);
    }

    loadAssets(function() {
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

});