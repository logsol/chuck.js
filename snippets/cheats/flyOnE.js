
var kd = window.onkeydown;
window.onkeydown = function (e) { 
	if(e.keyCode != 69) {
		kd(e);
		return;
	}
	var body = inspector.networker.gameController.me.doll.body
	body.SetPosition({
		x: body.GetPosition().x + 1,
		y: body.GetPosition().y
	})
}