var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

requirejs(["Chuck"], function(Chuck) {
	console.log('fertig Chuck');
	console.log(Chuck);
});