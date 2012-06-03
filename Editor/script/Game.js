function Game()
{
	this.Images = new Object();
	this.Buttons = new Object();
	this.images2Load = 0;
	this.imagesLoaded = 0;
	this.timer = null;
	this.self = this;
	this.mouseX = 0;
	this.mouseY = 0;
	this.click = false;
	this.wheel = 0;
	
	this.Init = function()
	{
		Debug('Init Game');
		
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.strokeRect(0, 460, 640, 20);
		
		LoadImages();
	};

	this.StartGame = function()
	{
		window.clearInterval(this.aktiv);
		this.ClearScreen();
		this.ClearButtons();
		
		InitGame();
	
		Debug('Starting Game');
		function timerRelay() 
		{
			RunningGame();
		} 
		
		this.aktiv = window.setInterval(timerRelay, 1000 / gameFps);
	};
	
	this.StartMenu = function()
	{
		window.clearInterval(this.aktiv);
		this.ClearScreen();
		this.ClearButtons();
		
		InitMenu();
		
		Debug('Load menu');
		function timerRelay() 
		{
			MainMenu();
		} 
		
		this.aktiv = window.setInterval(timerRelay, 1000 / menuFps);
	};
	
	this.InitButton = function(name, x, y, width, height, callback)
	{
		Debug('Init Button ' + name);
		if(this.Buttons[name] != undefined)
		{
			console.error('Button ' + name + ' wurde doppelt belegt!');
			return false;
		}
		this.Buttons[name] = new Button(x, y, width, height, callback);
	};
	
	this.InitImage = function(name, url)
	{
		Debug('LoadImage: ' + name + ' - ' + url);
		
		if(this.Images[name] != undefined)
		{
			console.error('Image ' + name + ' wurde doppelt belegt!');
			return false;
		}
		
		this.images2Load++;
		this.Images[name] = new Image();
		this.Images[name].onload = function(){game.ImageLoaded();};
		this.Images[name].src = url;
	};
	
	this.MouseClick = function(mouseX, mouseY)
	{
		this.click = true;
		Debug('check buttons');
		

		for(i in this.Buttons)
		{
			if(mouseX > this.Buttons[i].x && mouseY > this.Buttons[i].y
				&& mouseX <= (this.Buttons[i].x + this.Buttons[i].width) && mouseY <= (this.Buttons[i].y + this.Buttons[i].height))
			{
				Debug('button ' + i + ' pressed');
				this.Buttons[i].Press();
				this.click = false;
				return;
			}
		}
		
		if(selection == create)
		{
			CreateLemming(mouseX - 13, mouseY - 3);
			this.click = false;
			return;
		}
	};
	

	this.MouseWheel = function(speed)
	{
		this.wheel = speed;
	};
	
	this.MouseMove = function(mouseX, mouseY)
	{
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		
		var mouseOver = false;
		for(i in this.Buttons)
		{
			if(mouseX > this.Buttons[i].x && mouseY > this.Buttons[i].y
				&& mouseX <= (this.Buttons[i].x + this.Buttons[i].width) && mouseY <= (this.Buttons[i].y + this.Buttons[i].height))
			{
				mouseOver = true;
			}
		}
		
		if(mouseOver)
		{
			$('#game').css({cursor: 'pointer'});
		}
		else
		{
			$('#game').css({cursor: 'default'});
		}
	};
	
	this.ImageLoaded = function()
	{
		this.imagesLoaded++;
		Debug(this.imagesLoaded + ' von ' + this.images2Load + ' geladen');
		
		ctx.fillStyle = 'rgb(0, 150, 0)';
		ctx.fillRect(1, 461, 638 / this.images2Load * this.imagesLoaded, 18);
		
		if(this.images2Load == this.imagesLoaded)
		{
			game.ClearScreen();
			game.StartMenu();
		}
	};
	
	this.ClearButtons = function()
	{
		Debug('all Buttons cleared');
		this.Buttons = new Object();
	};
	
	this.ClearScreen = function()
	{
		ctx.clearRect(0, 0, 640, 480);
	};
}