define([
	"Game/" + GLOBALS.context + "/GameObjects/GameObject",
	"Lib/Vendor/Box2D",
	"Game/Config/Settings"
],
 
function (Parent, Box2D, Settings) {
 
    function Item(physicsEngine, uid, options) {
        this.options = options;
    	Parent.call(this, physicsEngine, uid);
        this.createFixture();
    }

    Item.prototype = Object.create(Parent.prototype);
 
    Item.prototype.getBodyDef = function() {

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = this.options.x / Settings.RATIO;
        bodyDef.position.y = this.options.y / Settings.RATIO;
        bodyDef.angle = 0;

        return bodyDef;
    }

    Item.prototype.createFixture = function () {

        var itemShape = new Box2D.Collision.Shapes.b2PolygonShape();
        var w = this.options.width / 2 / Settings.RATIO;
        var h = this.options.height / 2 / Settings.RATIO;
        itemShape.SetAsOrientedBox(w, h, new Box2D.Common.Math.b2Vec2(0, -h));

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = itemShape;
        fixtureDef.density = Settings.ITEM_DENSITY;
        fixtureDef.friction = Settings.ITEM_FRICTION;
        fixtureDef.restitution = Settings.ITEM_RESTITUTION;
        fixtureDef.isSensor = false;
        this.body.CreateFixture(fixtureDef);
    }
 
    return Item;
 
});