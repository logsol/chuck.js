requirejs.config({
    baseUrl: 'app',
    deps: ['Lib/Utilities/Extensions']
});

var inspector = {};

requirejs([
    "Game/Config/Settings",
    "Worker.js"
], 

function (Settings, Worker) {

    var worker = new Worker();

    inspector.worker = worker;
    inspector.settings = Settings;
});