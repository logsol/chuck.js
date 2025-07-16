"use strict"

Error.stackTraceLimit = Infinity;

var requirejs = require('requirejs');
var fs = require('fs');

var App = App || {};
App.inspector = {};
App.context = "Channel";

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',
    deps: ['Lib/Utilities/Channel/Extensions']
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
    "Server/Coordinator",
    "Game/Config/Settings"
], 

function (HttpServer, Socket, Coordinator, Settings) {

    var records = fs.readdirSync(Settings.CHANNEL_RECORDING_PATH);
    if (records.length > 200) {
        console.warn('Too many recordings!');
    }

    var coordinator = new Coordinator();
    var httpServer = new HttpServer(options, coordinator);
    var socket = new Socket(httpServer.getServer(), options, coordinator);

    App.inspector = {
        coordinator: coordinator,
        httpServer: httpServer,
        socket: socket
    }
});

exports = module.exports = App;