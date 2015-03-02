({
    baseUrl: "../app",
    paths: {
        "screenfull": "../node_modules/screenfull/dist/screenfull",
        "socketio": "../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io",
	"chart": "../node_modules/chart.js/Chart"
    },
    name: "../client",
    out: "../build/client.min.js",
    onBuildRead: function (moduleName, path, contents) {
        var contents = contents.replace(/\" \+ GLOBALS.context \+ \"/g, "Client");
        return contents;
    }
})
