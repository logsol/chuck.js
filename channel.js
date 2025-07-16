// "use strict"; intentionally omitted as App scope workaround

Error.stackTraceLimit = Infinity;

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',
    deps: ['Lib/Utilities/Channel/Extensions'],
    paths: {
        text: 'Lib/Vendor/RequireJs/Plugin/Text',
        json: 'Lib/Vendor/RequireJs/Plugin/Json',
    },
});


App = {};
App.inspector = {};
App.context = "Channel";

requirejs([
    "Game/Channel/PipeToServer"
],

function (PipeToServer) {
	var PipeToServer = new PipeToServer(process);
    
    App.inspector.PipeToServer = PipeToServer;
});