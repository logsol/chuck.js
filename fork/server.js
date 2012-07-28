var net = require('net'), 
	fork = require('child_process').fork;

var children = [];

var server = net.createServer(function (socket) {


	socket.write('Hey Client\r\n');

	var child = fork('child.js');
	children.push(child);

	child.send('id:' + children.length);
	child.send('server:handle', server);
	child.send('socket:handle', socket);
});

server.listen(1337, '127.0.0.1');

