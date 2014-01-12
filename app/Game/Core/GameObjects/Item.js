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
        this.body.ResetMassData();
        this.flipDirection = 1;
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

        var itemShape;
        var w = this.options.width / Settings.RATIO;
        var h = this.options.height / Settings.RATIO;

        if(this.options.type == 'circle'){
            var r = (w + h) / 4 ;
            itemShape = new Box2D.Collision.Shapes.b2CircleShape();
            itemShape.SetRadius(r);
            itemShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, -r));
        } else {
            itemShape = new Box2D.Collision.Shapes.b2PolygonShape();
            itemShape.SetAsOrientedBox(w / 2, h / 2, new Box2D.Common.Math.b2Vec2(0, -(h/2)));
        }
        

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = itemShape;

        var offset = 4,
            factor = 80;
        var density = ((this.options.weight + offset) / this.options.width / this.options.height) * factor;
        fixtureDef.density = density;
        fixtureDef.friction = Settings.ITEM_FRICTION;

        fixtureDef.restitution = this.options.bounce 
            ? this.options.bounce / 10
            : Settings.ITEM_RESTITUTION;

        fixtureDef.isSensor = false;

        this.body.CreateFixture(fixtureDef);
    }

    Item.prototype.flip = function(direction) {
        this.flipDirection = direction;

        // FIXME: implement body flip if necessary
    };
 
    return Item;
 
});