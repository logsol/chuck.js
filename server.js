GLOBALS = { context: "Server" };
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

console.checkpoint = function (s) {
    console.log('   \033[32mbeep  - \033[0m' + s);
}

console.warn = function (s) {
    console.log('   \033[33mwarn  - \033[0m' + s);
}

console.error = function (s) {
    console.log('   \033[31merror - \033[0m' + s);
}

requirejs([
    "Bootstrap/HttpServer", 
    "Bootstrap/Socket",
    "Lobby/Coordinator"
], 

function (HttpServer, Socket, Coordinator) {
    var coordinator = new Coordinator();
    var httpServer = new HttpServer(options);
    var socket = new Socket(httpServer.getServer(), options, coordinator);

    inspector = {
        coordinator: coordinator,
        httpServer: httpServer,
        socket: socket
    }
});

exports = module.exports = inspector;