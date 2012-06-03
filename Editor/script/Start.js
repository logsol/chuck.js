// Start and Init of all
var right = 1;
var left = -1;
var game = null;
var canvas = null;
var ctx = null;
var Map = new Object();
var walk = 1;
var fall = 2;
var smash = 3;
var fly = 4;
var delve = 5;
var stair = 6;
var create = 99;
var selection = 0;
var gameFrame = 0;

$(document).ready(function()
{
	canvas = document.getElementById('editor');
	ctx = canvas.getContext('2d');
	
	$('body').live('keypress', function(e)
	{
		Debug('Key: ' + e.which);
		switch (e.which) 
		{
			case 45: // +
				if(zoomSize > 10)
				{
					zoomSize -= 5;
				}
				break;
				
			case 43: // -
				if(zoomSize < 50)
				{
					zoomSize += 5;
				}
				break;
	
			case 49: // 1
			case 50: // 2
			case 51: // 3
			case 52: // 4
			case 53: // 5
			case 54: // 6
			case 55: // 7
			case 56: // 8
				tileType = (e.which - 49);
				break;
				
			default:
				break;
		}
	});
	
	// event für mausrad
	$('#editor').bind('mousewheel', function(event, delta, deltaX, deltaY) 
	{
		if(delta > 0)
		{
			game.MouseWheel(+1);
		}
		
		if(delta < 0)
		{
			game.MouseWheel(-1);
		}
		
        return false;
    });

	
	// event für mausposition
	$('#editor').bind('click', function(event)
	{
		var offset = $('#editor').offset();
		
		var mouseX = event.clientX - offset.left;
		var mouseY = event.clientY - offset.top;
		
		game.MouseClick(mouseX, mouseY);
	});
	
	// event für mausposition
	$('#editor').mousemove(function(event)
	{
		var offset = $('#editor').offset();
		
		var mouseX = event.clientX - offset.left;
		var mouseY = event.clientY - offset.top;
		
		game.MouseMove(mouseX, mouseY);
	});
	
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillRect(0, 0, 640, 480);
	
	// Ab hier kommt das preload aller images und sound files
	var img = new Image();
	img.onload = function()
	{
//		ctx.drawImage(img, 31, 0);
		game = new Game();
		game.Init();
	};
	img.src = bootLoaderImg;
});