GLOBALS = { context: "Server" };
var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
});

var inspector = {};

requirejs([
    "Game/Server/PipeToLobby"
], 

function (PipeToLobby) {
	var PipeToLobby = new PipeToLobby(process);
    
    inspector.PipeToLobby = PipeToLobby;
});