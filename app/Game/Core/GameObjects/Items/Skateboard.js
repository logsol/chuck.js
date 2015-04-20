define([
	"Game/" + GLOBALS.context + "/GameObjects/Item",
	"Lib/Vendor/Box2D",
	"Game/Config/Settings",
    "Lib/Utilities/Assert"
],
 
function (Parent, Box2D, Settings, Assert) {

	"use strict";
 
    function Skateboard(physicsEngine, uid, options) {

    	Parent.call(this, physicsEngine, uid, options);
    }

    Skateboard.prototype = Object.create(Parent.prototype);

    Skateboard.prototype.createFixture = function () {
        Assert.number(this.options.width, this.options.height);
        Assert.number(this.options.weight);

        var deckShape = new Box2D.Collision.Shapes.b2PolygonShape();
        var w = this.options.width / Settings.RATIO;
        var h = 2 / Settings.RATIO;
        deckShape.SetAsOrientedBox(w / 2, h / 2, new Box2D.Common.Math.b2Vec2(0, -(4.5 / Settings.RATIO)));

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = deckShape;

        var offset = 4,
            factor = 80;
        var density = ((this.options.weight + offset) / this.options.width / this.options.height) * factor;
        fixtureDef.density = density;
        fixtureDef.friction = Settings.ITEM_FRICTION;
        fixtureDef.restitution = 0.2;
        fixtureDef.isSensor = false;

        this.body.CreateFixture(fixtureDef);


        this.addWheel(
            -8,
            -2.5
        );

        this.addWheel(
            7,
            -2.5
        );

    };

    Skateboard.prototype.addWheel = function(x, y) {
        Assert.number(x, y);

    	var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = x / Settings.RATIO;
        bodyDef.position.y = y / Settings.RATIO;
        bodyDef.angle = 0;

    	var wheelShape = new Box2D.Collision.Shapes.b2CircleShape();
        wheelShape.SetRadius(2.5 / Settings.RATIO);
        wheelShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(x / Settings.RATIO, y / Settings.RATIO));


        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        var offset = 4,
            factor = 80;
        var density = ((0.1 + offset) / 3 / 3) * factor;
        fixtureDef.density = density;
        fixtureDef.shape = wheelShape;
        fixtureDef.restitution = 0.2;
        fixtureDef.isSensor = false;
        fixtureDef.friction = 0.0005;

        this.body.CreateFixture(fixtureDef);
    };

    Skateboard.prototype.flip = function(direction) {
        this.flipDirection = direction;
    };
 
    return Skateboard;
 
});


/*
define([
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Vendor/Box2D",
    "Game/Config/Settings",
    "Lib/Utilities/Assert"
],
 
function (Parent, Box2D, Settings, Assert) {

    "use strict";
 
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
        Assert.number(this.options.width, this.options.height);
        Assert.number(this.options.weight);

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
    };

    Skateboard.prototype.addWheel = function(x, y) {
        Assert.number(x, y);

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
        fixtureDef.friction = 0;

        var wheelBody = this.body.GetWorld().CreateBody(bodyDef);
        wheelBody.CreateFixture(fixtureDef);
            
        //var revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        var revoluteJointDef = new Box2D.Dynamics.Joints.b2WeldJointDef();
        //revoluteJointDef.enableMotor = false;



        revoluteJointDef.Initialize(this.body, wheelBody, wheelBody.GetWorldCenter());
        var j = this.body.GetWorld().CreateJoint(revoluteJointDef);


        // FIXME this means, that we will have bodies in the world, which must not be
        // updated (wheels) because they are always connected to a body which will be updated.
        return wheelBody;
    };

    Skateboard.prototype.flip = function(direction) {
        this.flipDirection = direction;

        // FIXME: implement body flip if necessary
    };

    Skateboard.prototype.throw = function(options, carrierVelocity) {
        Parent.prototype.throw.call(this, options, carrierVelocity);

        for (var i = 0; i < this.wheels.length; i++) {
            var body = this.wheels[i];

            this.accelerateBody(body, options, carrierVelocity);
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
*/