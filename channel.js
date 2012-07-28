var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'app'
});

var inspector = {};

requirejs(["Bootstrap/Channel"], function (ChannelBootstrap) {
    
    var channelBootstrap = new ChannelBootstrap(process);
    inspector.channelBootstrap = channelBootstrap;
});