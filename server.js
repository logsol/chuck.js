GLOBALS = { context: "Channel" };
var requirejs = require('requirejs');

var inspector;

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
});

var port = process.argv[2]
    || process.env.PORT
    || process.env.npm_package_config_port;

var options = {
    port: port,
    rootDirectory: './',
    caching: 0,
    logLevel: process.argv[3] || 0
};

requirejs([
    "Bootstrap/HttpServer", 
    "Bootstrap/Socket",
    "Server/Coordinator"
], 

function (HttpServer, Socket, Coordinator) {
    var coordinator = new Coordinator();
    var httpServer = new HttpServer(options, coordinator);
    var socket = new Socket(httpServer.getServer(), options, coordinator);

    inspector = {
        coordinator: coordinator,
        httpServer: httpServer,
        socket: socket
    }
});

exports = module.exports = inspector;