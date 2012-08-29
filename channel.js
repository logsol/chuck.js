var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app'
});

var inspector = {};

requirejs([
    "Game/Server/PipeToLobby",
    "Game/Core/NotificationCenter"
], 

function (PipeToLobby, nc) {
	var PipeToLobby = new PipeToLobby(process);
    
    inspector.PipeToLobby = PipeToLobby;
});