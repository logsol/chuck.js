define([
	"Game/Client/View/Pixi/Layer",
	"Lib/Vendor/Pixi",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings"
],
 
function (Parent, PIXI, Nc, Settings) {
 
    function Swiper() {
    	Parent.call(this, "swiper", 0);

        this.static = true;

    	this.ncTokens = [
            Nc.on(Nc.ns.client.view.swiper.swipe, this.swipe, this),
            Nc.on(Nc.ns.client.view.swiper.end, this.end, this)
        ];

        this.sprite = new PIXI.Graphics();
        this.container.addChild(this.sprite);

        this.end();
    }

    Swiper.prototype = Object.create(Parent.prototype);

    Swiper.prototype.swipe = function(x, y) {
        var offset = {
            x: Settings.STAGE_WIDTH / 2 / this.zoom.current,
            y: Settings.STAGE_HEIGHT / 2 / this.zoom.current,
        }

		this.sprite.moveTo(offset.x + this.last.x, offset.y + this.last.y);

		this.last.x = x;
    	this.last.y = -y;

        this.sprite.lineTo(offset.x + this.last.x, offset.y + this.last.y);
    };
 
 	Swiper.prototype.end = function(x, y) {
 		this.sprite.clear();

    	this.sprite.lineStyle(2, 0xffffff);
        this.sprite.alpha = 0.5;
        
        this.last = {
        	x: 0,
        	y: 0 
        }
 	};
    
 
    return Swiper;
 
});