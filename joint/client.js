var id = null;
var lastIntervalTime = new Date().getTime();

function setupCanvas() {
	var debugDraw = new b2DebugDraw();

	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

	world.SetDebugDraw(debugDraw);
}

function init() {
	setupWorld(9);
	setupCanvas();

	window.setInterval(update, 1000 / 60);

	var body;

	function update() {
	   var newTime = new Date().getTime()
	   lastIntervalTime = newTime;		
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


function findBody(index) {
	var body = null;

	var nextBody = world.GetBodyList();
	for (var i = 0; i < bodiesNum; i++) {
		if (nextBody.GetUserData().bodyId == index) { body = nextBody; break; }
		nextBody = nextBody.GetNext();
	}

	return body;
}


window.onload = init;
