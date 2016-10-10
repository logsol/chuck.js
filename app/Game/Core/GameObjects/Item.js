define([
	"Game/" + GLOBALS.context + "/GameObjects/GameObject",
	"Lib/Vendor/Box2D",
    "Lib/Utilities/Options",
	"Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert"
],
 
function (Parent, Box2D, Options, Settings, Exception, nc, Assert) {

	"use strict";
 
    function Item(physicsEngine, uid, options) {

        var floatOptions = {
            grabAngle: parseFloat(options.grabAngle),
            danger: parseFloat(options.danger),
            weight: parseFloat(options.weight),
            width: parseFloat(options.width),
            height: parseFloat(options.height),
            rotation: parseFloat(options.rotation),
            bounce: parseFloat(options.bounce),
            x: parseFloat(options.x),
            y: parseFloat(options.y)
        };

        this.options = Options.merge(floatOptions, options);

        if(!this.options.category) {
            // FIXME add more validation
            //console.warn('item category empty (' + this.options.name + ')' );
        }

    	Parent.call(this, physicsEngine, uid);
        this.createFixture();
        this.body.ResetMassData();
        this.flipDirection = 1;
        if (this.body.GetMass() < 1) {
            this.body.SetBullet(true);
        }

        nc.trigger(nc.ns.core.game.worldUpdateObjects.add, this);
    }

    Item.prototype = Object.create(Parent.prototype);
 
    Item.prototype.getBodyDef = function() {
        Assert.number(this.options.x, this.options.y);
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = this.options.x / Settings.RATIO;
        bodyDef.position.y = this.options.y / Settings.RATIO;
        bodyDef.angle = 0;

        return bodyDef;
    };

    Item.prototype.getFixtureDef = function() {
        Assert.number(this.options.width, this.options.height);
        Assert.number(this.options.weight);
        Assert.number(this.options.bounce);

        var itemShape;
        var w = this.options.width / Settings.RATIO;
        var h = this.options.height / Settings.RATIO;

        if(this.options.type == "circle") {
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

        fixtureDef.density = this.options.weight;
        fixtureDef.friction = Settings.ITEM_FRICTION;

        fixtureDef.restitution = this.options.bounce ? this.options.bounce / 10 : Settings.ITEM_RESTITUTION;

        fixtureDef.isSensor = false;

        fixtureDef.userData = {
            onCollisionChange: this.onCollisionChange.bind(this)
        };

        return fixtureDef;
    };

    Item.prototype.createFixture = function () {
        var fixtureDef = this.getFixtureDef();
        this.body.CreateFixture(fixtureDef);
    };

    Item.prototype.flip = function(direction) {
        this.flipDirection = direction;

        // FIXME: implement body flip if necessary
    };

    Item.prototype.beingGrabbed = function(player) { // jshint unused:false
        // overwrite if necessary
    };

    Item.prototype.beingReleased = function(player) { // jshint unused:false
        // overwrite if necessary
    };

    Item.prototype.onCollisionChange = function(isColliding, fixture, info) { // jshint unused:false
        // overwrite if necessary
    };

    Item.prototype.reposition = function(handPosition, direction) {
        Assert.number(handPosition.x, handPosition.y);
        Assert.number(direction);
        Assert.number(this.options.width);
        Assert.number(this.options.grabAngle);

        this.body.SetAwake(true);
        var position = new Box2D.Common.Math.b2Vec2(
            handPosition.x + ((this.options.width / Settings.RATIO / 2) * direction),
            handPosition.y
        );
        this.body.SetPosition(position);
        this.body.SetAngle((this.options.grabAngle || 0.0) * direction);
        this.flip(direction);
    };

    Item.prototype.getGrabPoint = function() {
        return this.body.GetWorldCenter();
    };

    Item.prototype.throw = function(options, carrierVelocity) {
        this.accelerateBody(this.body, options, carrierVelocity);
    };

    Item.prototype.accelerateBody = function(body, options, carrierVelocity) {
        Assert.number(this.options.weight);
        Assert.number(carrierVelocity.x, carrierVelocity.y);
        Assert.number(options.x, options.y);
        Assert.number(options.av);

        body.SetAwake(true);

        var x = options.x * Settings.MAX_THROW_FORCE / this.options.weight + carrierVelocity.x;
        var y = -options.y * Settings.MAX_THROW_FORCE / this.options.weight + carrierVelocity.y;
        var vector = new Box2D.Common.Math.b2Vec2(x, y);
        body.SetLinearVelocity(vector);

        var av = -options.av * Settings.MAX_THROW_ANGULAR_VELOCITY;
        body.SetAngularVelocity(av);
    };

    Item.prototype.destroy = function() {
        nc.trigger(nc.ns.core.game.worldUpdateObjects.remove, this);
        Parent.prototype.destroy.call(this);
    };
 
    return Item;
 
});