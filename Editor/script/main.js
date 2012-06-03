// Settings
var menuFps = 30;
var gameFps = 30;
var bootLoaderImg = "img/sh.png";
var debug = true;
var zoomSize = 40;
var tileType = 1;
var tileRotation = 0;

// The Game routine is called 35 times in a second
function RunningGame()
{
	game.ClearScreen();

	if(game.wheel)
	{
		tileRotation += game.wheel;
		if(tileRotation > 3)
		{
			tileRotation = 0;
		}
		if(tileRotation < 0)
		{
			tileRotation = 3;
		}
	}
	
	// male alle tiles die schonmal gesetzt wurden
	
	
	
	// das Maustile
	ctx.drawImage(
			game.Images.tileshape, 
			tileRotation * 40, 
			tileType * 40, 
			40, 
			40, 
			Math.round(game.mouseX / zoomSize) * zoomSize, 
			Math.round(game.mouseY / zoomSize) * zoomSize, 
			zoomSize, 
			zoomSize
		);

	// rahmen um Maus
	ctx.strokeStyle = 'rgb(0, 255, 0)';
	ctx.strokeRect(Math.round(game.mouseX / zoomSize) * zoomSize, 
			Math.round(game.mouseY / zoomSize) * zoomSize, 
			zoomSize, 
			zoomSize
	);

	
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillText(Math.round(game.mouseX / zoomSize) + ', ' + Math.round(game.mouseY / zoomSize) + ' zoom: ' + zoomSize, 0, 10);
	
	game.click = false;
	game.wheel = 0;
}

// The MainMenu routine is called 35 times in a second
function MainMenu()
{
//	ctx.drawImage(game.Images.menu, 0, 0);
//	
//	ctx.font = '30px "arial", arial';
//	ctx.fillStyle = '#99ff99';
//	
//	ctx.fillRect(150, 200, 100, 40);
//	
//	ctx.fillStyle = 'rgb(0, 0, 0)';
//	ctx.fillText('Start', 167, 230);
}

//Button Callbacks
//function ButtonTestPressed()
//{
//	game.StartGame();
//}
//
//function SelectDelve()
//{
//	selection = delve;
//}
//
//function SelectStair()
//{
//	selection = stair;
//}
//
//function SelectCreate()
//{
//	selection = create;
//}

// Init methods
function LoadImages()
{
	game.InitImage('tileshape', 'img/tile_shape_rotation_map.jpg');
//	game.InitImage('menu', 'img/menu.jpg');
//	game.InitImage('lemming', 'img/lemming_anim.png');
//	game.InitImage('map', 'img/map.png');
//	game.InitImage('button', 'img/button.png');
}

function InitMenu()
{
	game.StartGame();
	// Hier werden dann mal Buttons definiert 
	// evtl wirds auch ausgelagert
//	game.InitButton('Start', 150, 200, 100, 40, ButtonTestPressed);
}

function InitGame()
{
//  game.InitButton('SelectCreate', 10, 450, 25, 25, SelectCreate);
//	game.InitButton('SelectDelve', 40, 450, 25, 25, SelectDelve);
//	game.InitButton('SelectStair', 70, 450, 25, 25, SelectStair);
}