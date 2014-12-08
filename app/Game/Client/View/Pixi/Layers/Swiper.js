define([
	"Game/Client/View/Pixi/Layer",
	"Lib/Vendor/Pixi",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings"
],
 
function (Parent, PIXI, Nc, Settings) {
 
    function Swiper() {
    	Parent.call(this, "ghost", 0);

    	this.ncTokens = [
            Nc.on(Nc.ns.client.view.swiper.swipe, this.swipe, this),
            Nc.on(Nc.ns.client.view.swiper.end, this.end, this)
        ];

        this.offset = {
        	x: Settings.STAGE_WIDTH / 2,
        	y: Settings.STAGE_HEIGHT / 2
        }

        this.sprite = new PIXI.Graphics();
        this.container.addChild(this.sprite);

        this.end();
    }

    Swiper.prototype = Object.create(Parent.prototype);

    Swiper.prototype.swipe = function(x, y) {

		this.sprite.moveTo(this.offset.x + this.last.x, this.offset.y + this.last.y);

		this.last.x += x;
    	this.last.y -= y;

        this.sprite.lineTo(this.offset.x + this.last.x, this.offset.y + this.last.y);
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