define([
	"Game/" + GLOBALS.context + "/GameObjects/Item",
	"Lib/Vendor/Box2D",
	"Game/Config/Settings"
],
 
function (Parent, Box2D, Settings) {
 
    function Skateboard(physicsEngine, uid, options) {

    	Parent.call(this, physicsEngine, uid, options);

        this.wheels = [
        	this.addWheel(
        		options.x + 8,
        		options.y - 1.5
        	),
        	this.addWheel(
        		options.x - 8,
        		options.y - 1.5
        	)
        ];
    }

    Skateboard.prototype = Object.create(Parent.prototype);

    Skateboard.prototype.createFixture = function () {

        var deckShape = new Box2D.Collision.Shapes.b2PolygonShape();
        var w = this.options.width / Settings.RATIO;
        var h = 1.5 / Settings.RATIO;
        deckShape.SetAsOrientedBox(w / 2, h / 2, new Box2D.Common.Math.b2Vec2(0, -(4.5 / Settings.RATIO)));

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = deckShape;

        var offset = 4,
            factor = 80;
        var density = ((this.options.weight + offset) / this.options.width / this.options.height) * factor;
        fixtureDef.density = density;
        fixtureDef.friction = Settings.ITEM_FRICTION;
        fixtureDef.restitution = Settings.ITEM_RESTITUTION;
        fixtureDef.isSensor = false;

        this.body.CreateFixture(fixtureDef);
    }

    Skateboard.prototype.addWheel = function(x, y) {

    	var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = x / Settings.RATIO;
        bodyDef.position.y = y / Settings.RATIO;
        bodyDef.angle = 0;

    	var wheelShape = new Box2D.Collision.Shapes.b2CircleShape();
        wheelShape.SetRadius(1.5 / Settings.RATIO);
        wheelShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, 0));

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        var offset = 4,
            factor = 80;
        var density = ((0.1 + offset) / 3 / 3) * factor;
        fixtureDef.density = density;
        fixtureDef.shape = wheelShape;
        fixtureDef.isSensor = false;

        var wheelBody = this.body.GetWorld().CreateBody(bodyDef);
        wheelBody.CreateFixture(fixtureDef);
            
		var revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		revoluteJointDef.enableMotor = false;

		revoluteJointDef.Initialize(this.body, wheelBody, wheelBody.GetWorldCenter());
		this.body.GetWorld().CreateJoint(revoluteJointDef);

		// FIXME this means, that we will have bodies in the world, which must not be
		// updated (wheels) because they are always connected to a body which will be updated.
        return wheelBody;
    };

    Skateboard.prototype.flip = function(direction) {
        this.flipDirection = direction;

        // FIXME: implement body flip if necessary
    };

    Skateboard.prototype.throw = function(x, y) {
        Parent.prototype.throw.call(this, x, y);

        for (var i = 0; i < this.wheels.length; i++) {
            var body = this.wheels[i];
            body.SetAwake(true);

            var vector = new Box2D.Common.Math.b2Vec2(
                x * Settings.MAX_THROW_FORCE / this.options.weight,
                -y * Settings.MAX_THROW_FORCE / this.options.weight
            );
            body.SetLinearVelocity(vector);
        }
    };

    Skateboard.prototype.destroy = function() {
        for (var i = 0; i < this.wheels.length; i++) {
            this.body.GetWorld().DestroyBody(this.wheels[i]);
        }

        Parent.prototype.destroy.call(this);
    };
 
    return Skateboard;
 
});