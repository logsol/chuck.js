var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'app'
});

var inspector = {};

requirejs([
    "Game/Server/LobbyPipe"
], 

function (LobbyPipe) {
	var lobbyPipe = new LobbyPipe(process);
    
    inspector.lobbyPipe = lobbyPipe;
});