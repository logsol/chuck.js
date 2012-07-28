define([
    "Game/Server/Channel",
    "Game/Server/CoordinatorLink"
],

function (Channel, CoordinatorLink) {

    function ChannelBootstrap(process) {

        var coordinatorLink = new CoordinatorLink(process);
        var channel = null;

        process.on('message', function (message) {

            switch(message){
                case 'CREATE':
                    channel = new Channel(coordinatorLink);
                    break;

                case 'KILL':
                    channel.destroy();
                    process.exit(0);
                    break;

                default:
                    coordinatorLink.receive(message);
                    break;
            }
        });    
    }

    return ChannelBootstrap;
    
});