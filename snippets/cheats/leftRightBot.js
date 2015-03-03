var runFor = 5000;
var jumpEvery = 1300;

var runBot = setInterval(function(){

	Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'stop');
	Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'lookAt', {x:-0.5, y:0});
	Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'moveLeft');

	setTimeout(function(){
		Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'stop');
		Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'lookAt', {x:0.5, y:0});
		Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'moveRight');
	}, runFor);

}, runFor * 2);

var jumpBot = setInterval(function(){

	Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'jump');

	setTimeout(function(){
		Chuck.inspector.nc.trigger(Chuck.inspector.nc.ns.client.to.server.gameCommand.send, 'jumpStop');
	}, (jumpEvery - 100));

}, jumpEvery);

function stop () {
	clearInterval(runBot);
	clearInterval(jumpBot);
}