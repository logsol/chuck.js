var id = null;

function setupCanvas() {
	var debugDraw = new b2DebugDraw();

	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

	world.SetDebugDraw(debugDraw);
}

function _jump() {
	jump();
	
	var data = {
		m: 'jump'
	};
	socket.send(JSON.stringify(data));
}

function init() {
	setupWorld();
	setupCanvas();

	window.setInterval(update, 1000 / 60);

	var body;

	//update
	function update() {
		world.Step(1 / 60, 10, 10);
		world.DrawDebugData();
		world.ClearForces();
	}
}
         
//helpers
         
//http://js-tut.aardon.de/js-tut/tutorial/position.html
function getElementPosition(element) {
	var elem = element, tagname = "", x = 0, y = 0;
           
	while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
		y += elem.offsetTop;
		x += elem.offsetLeft;

		tagname = elem.tagName.toUpperCase();

		if(tagname == "BODY") elem = 0;

		if(typeof(elem) == "object") {
			if(typeof(elem.offsetParent) == "object") elem = elem.offsetParent;
		}

		return {x: x, y: y};
	}
}

function updateWorld(data) {
	var body = world.GetBodyList();
	do {
		var userData = body.GetUserData();
		if(userData && userData.bodyId){		
			var update = data[userData.bodyId];
			body.SetPosition(update.p);
			body.SetAngle(update.a);
			body.SetLinearVelocity(update.v);
		}
	} while (body = body.GetNext());
}




var socket = io.connect(xhost + ':' + xport);

socket.on('connect',function() {
	console.log('Client has connected to the server!');
	connected = true;
});

socket.on('message', function(packet) {
	packet = JSON.parse(packet);
	//console.log(packet);
	
	if (packet && packet.m) {
		switch(packet.m) {
			case 'world-update':
				updateWorld(packet.d);
				break;
			default:	
				break;
		}
		
	}
});

socket.on('disconnect',function() {
	console.log('The client has disconnected!');
	connected = false;
});


window.onload = init;