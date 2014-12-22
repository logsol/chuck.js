"use strict";

var GLOBALS = { context: "Channel" };
var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
});

var inspector = {};

requirejs([
    "Game/Channel/PipeToServer"
], 

function (PipeToServer) {
	var PipeToServer = new PipeToServer(process);
    
    inspector.PipeToServer = PipeToServer;
});