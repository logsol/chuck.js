console.log('spawned');

process.on('message', function (message, handle) {
	var pack = message.split(':'),
		command = pack[0],
		data = pack[1];

	switch(command) {
		case 'id':
			console.log('This is child #' + data);
			break;

		case 'server':
			console.log('child #' + data + ' got server.', handle);
			break;

		case 'socket':
			console.log('child #' + data + ' got socket.', handle);
			handle.on('data', onSocketMessage);
			break;
	}
});


function onSocketMessage (data) {
	console.log('onSocketMessage', data.toString('utf-8'));
}