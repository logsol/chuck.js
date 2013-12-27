GLOBALS = { context: "Server" };
var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
});

var inspector = {};

console.checkpoint = function (s) {
    console.log('   \033[34mbeep  - \033[0m' + s);
}

requirejs([
    "Game/Server/PipeToLobby",
    "Lib/Utilities/NotificationCenter"
], 

function (PipeToLobby, nc) {
	var PipeToLobby = new PipeToLobby(process);
    
    inspector.PipeToLobby = PipeToLobby;
});