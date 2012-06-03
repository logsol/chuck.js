// Button Class
function Button(x, y, width, height, callback)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.callback = callback;
	
	this.Press = function()
	{
		this.callback.call();
	};
}