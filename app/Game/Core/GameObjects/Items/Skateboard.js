define([
	"Game/" + GLOBALS.context + "/GameObjects/Item",
	"Lib/Vendor/Planck",
	"Game/Config/Settings",
    "Lib/Utilities/Assert"
],
 
function (Parent, planck, Settings, Assert) {

	"use strict";
 
    function Skateboard(physicsEngine, uid, options) {

    	Parent.call(this, physicsEngine, uid, options);
    }

    Skateboard.prototype = Object.create(Parent.prototype);

    Skateboard.prototype.createFixture = function () {
        Assert.number(this.options.width, this.options.height);
        Assert.number(this.options.weight);

        var w = this.options.width / Settings.RATIO;
        var h = 2 / Settings.RATIO;
        var deckShape = planck.Box(w / 2, h / 2, planck.Vec2(0, -(4.5 / Settings.RATIO)));

        var fixtureDef = { shape: null, density: 1.0, friction: 0.3, restitution: 0.0, isSensor: false };
        fixtureDef.shape = deckShape;

        var offset = 4,
            factor = 80;
        var density = ((this.options.weight + offset) / this.options.width / this.options.height) * factor;
        fixtureDef.density = density;
        fixtureDef.friction = Settings.ITEM_FRICTION;
        fixtureDef.restitution = 0.2;
        fixtureDef.isSensor = false;

        this.body.createFixture(fixtureDef);


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

    	var bodyDef = { 
            type: 'dynamic',
            position: planck.Vec2(x / Settings.RATIO, y / Settings.RATIO),
            angle: 0
        };

    	var wheelShape = planck.Circle(2.5 / Settings.RATIO, planck.Vec2(x / Settings.RATIO, y / Settings.RATIO));


        var fixtureDef = { shape: null, density: 1.0, friction: 0.3, restitution: 0.0, isSensor: false };
        var offset = 4,
            factor = 80;
        var density = ((0.1 + offset) / 3 / 3) * factor;
        fixtureDef.density = density;
        fixtureDef.shape = wheelShape;
        fixtureDef.restitution = 0.2;
        fixtureDef.isSensor = false;
        fixtureDef.friction = 0.0005;

        this.body.createFixture(fixtureDef);
    };

    Skateboard.prototype.flip = function(direction) {
        this.flipDirection = direction;
    };
 
    return Skateboard;
 
});


/*
define([
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Vendor/Planck",
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

        var w = this.options.width / Settings.RATIO;
        var h = 1.5 / Settings.RATIO;
        var deckShape = planck.Box(w / 2, h / 2, planck.Vec2(0, -(4.5 / Settings.RATIO)));

        var fixtureDef = { shape: null, density: 1.0, friction: 0.3, restitution: 0.0, isSensor: false };
        fixtureDef.shape = deckShape;

        var offset = 4,
            factor = 80;
        var density = ((this.options.weight + offset) / this.options.width / this.options.height) * factor;
        fixtureDef.density = density;
        fixtureDef.friction = Settings.ITEM_FRICTION;
        fixtureDef.restitution = Settings.ITEM_RESTITUTION;
        fixtureDef.isSensor = false;

        this.body.createFixture(fixtureDef);
    };

    Skateboard.prototype.addWheel = function(x, y) {
        Assert.number(x, y);

        var bodyDef = { 
            type: 'dynamic',
            position: planck.Vec2(x / Settings.RATIO, y / Settings.RATIO),
            angle: 0
        };

        var wheelShape = planck.Circle(1.5 / Settings.RATIO, planck.Vec2(0, 0));

        var fixtureDef = { shape: null, density: 1.0, friction: 0.3, restitution: 0.0, isSensor: false };
        var offset = 4,
            factor = 80;
        var density = ((0.1 + offset) / 3 / 3) * factor;
        fixtureDef.density = density;
        fixtureDef.shape = wheelShape;
        fixtureDef.isSensor = false;
        fixtureDef.friction = 0;

        var wheelBody = this.body.getWorld().createBody(bodyDef);
        wheelBody.createFixture(fixtureDef);
            
        // See top of file for Planck.js joint creation reference.

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
            this.body.getWorld().destroyBody(this.wheels[i]);
        }

        Parent.prototype.destroy.call(this);
    };
 
    return Skateboard;
 
});
*/