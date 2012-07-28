define([
    "Bootstrap/HttpServer", 
    "Bootstrap/Socket",
    "Lobby/Coordinator"
],

function (HttpServer, Socket, Coordinator) {

    function Server(options) {
        coordinator = new Coordinator();
        httpServer = new HttpServer(options);
        this.socket = new Socket(httpServer.getServer(), options, coordinator);
    }

    return Server;
});