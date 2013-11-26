var myCanvas = null;
myCanvas = document.getElementsByTagName('canvas')[0];

myCanvas.onmousemove = function(e){
	console.log(e.clientX - this.offsetLeft)
}