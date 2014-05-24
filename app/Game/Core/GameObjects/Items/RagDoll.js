define([
	"Game/" + GLOBALS.context + "/GameObjects/Item",
	"Lib/Vendor/Box2D",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter"
],
 
function (Parent, Box2D, Settings, Nc) {
 
    function RagDoll(physicsEngine, uid, options) {

        // Sensor size
        options.width = 20;
        options.height = 40;

        options.limbs = {};
        options.limbs.chest = {
            width: 6,
            height: 18,
            x: 0,
            y: 0
        };

        options.limbs.head = {
            width: 10,
            height: 12,
            x: 0,
            y: - options.limbs.chest.height / 2 - 7
        };

        options.limbs.upperLeftLeg = {
            width: 3,
            height: 4,
            x: -2,
            y: options.limbs.chest.height / 2
        };

        options.limbs.upperRightLeg = {
            width: 3,
            height: 4,
            x: 2,
            y: options.limbs.chest.height / 2
        };

        options.limbs.lowerLeftLeg = {
            width: 4,
            height: 4,
            x: -2,
            y: options.limbs.chest.height / 2 + options.limbs.upperLeftLeg.height
        };

        options.limbs.lowerRightLeg = {
            width: 4,
            height: 4,
            x: 2,
            y: options.limbs.chest.height / 2 + options.limbs.upperRightLeg.height
        };





        options.limbs.upperLeftArm = {
            width: 2,
            height: 8,
            x: -2,
            y: -options.limbs.chest.height / 2
        };

        options.limbs.upperRightArm = {
            width: 3,
            height: 8,
            x: 2,
            y: -options.limbs.chest.height / 2
        };

        options.limbs.lowerLeftArm = {
            width: 2,
            height: 5,
            x: -2,
            y: -options.limbs.chest.height / 2 + options.limbs.upperLeftArm.height
        };

        options.limbs.lowerRightArm = {
            width: 2,
            height: 5,
            x: 2,
            y: -options.limbs.chest.height / 2 + options.limbs.upperRightArm.height
        };







        Parent.call(this, physicsEngine, uid, options);
        //this.createSensor();

        this.limbs = {};

    	this.addHead();


        this.addLimb(
            "upperLeftLeg", 
            this.body, 
            options.limbs.upperLeftLeg.x, 
            options.limbs.chest.height / 2
        );

        this.addLimb(
            "upperRightLeg", 
            this.body, 
            options.limbs.upperRightLeg.x, 
            options.limbs.chest.height / 2
        );

        this.addLimb(
            "lowerLeftLeg", 
            this.limbs.upperLeftLeg, 
            0, 
            options.limbs.upperLeftLeg.height / 2
        );

        this.addLimb(
            "lowerRightLeg", 
            this.limbs.upperRightLeg, 
            0, 
            options.limbs.upperRightLeg.height / 2
        );





        this.addLimb(
            "upperLeftArm", 
            this.body, 
            options.limbs.upperLeftArm.x, 
            -options.limbs.chest.height / 2
        );

        this.addLimb(
            "upperRightArm", 
            this.body, 
            options.limbs.upperRightArm.x, 
            -options.limbs.chest.height / 2
        );

        this.addLimb(
            "lowerLeftArm", 
            this.limbs.upperLeftArm, 
            0, 
            options.limbs.upperLeftArm.height / 2
        );

        this.addLimb(
            "lowerRightArm", 
            this.limbs.upperRightArm, 
            0, 
            options.limbs.upperRightArm.height / 2
        );
    }

    RagDoll.prototype = Object.create(Parent.prototype);

    RagDoll.prototype.getId = function() {
        return 55; //parseInt(this.uid.split("-")[1], 10);
    };

    RagDoll.prototype.getPosition = function() {
        return this.body.GetPosition().Copy();
    };

    RagDoll.prototype.getHeadPosition = function() {
        return this.limbs.head.GetPosition().Copy();
    };

    RagDoll.prototype.getBodyDef = function() {
        var bodyDef = Parent.prototype.getBodyDef.call(this);
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        return bodyDef;
    };

    RagDoll.prototype.getFixtureDef = function() {
        var fixtureDef = Parent.prototype.getFixtureDef.call(this);
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;
        fixtureDef.filter.groupIndex = -this.getId();

        var shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsOrientedBox(
            this.options.limbs.chest.width / 2 / Settings.RATIO,
            this.options.limbs.chest.height / 2 / Settings.RATIO,
            new Box2D.Common.Math.b2Vec2(0, 0)
        );

        fixtureDef.shape = shape;

        return fixtureDef;
    };

    RagDoll.prototype.createSensor = function() {
        var w = this.options.width / Settings.RATIO;
        var h = this.options.height / Settings.RATIO;

        var itemShape = new Box2D.Collision.Shapes.b2PolygonShape();
        itemShape.SetAsOrientedBox(w / 2, h / 2, new Box2D.Common.Math.b2Vec2(0, 0));

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = itemShape;
        fixtureDef.isSensor = true;

        fixtureDef.userData = {
            onCollisionChange: this.onCollisionChange.bind(this)
        }

        this.body.CreateFixture(fixtureDef);
    };

    RagDoll.prototype.addHead = function() {
        var x = this.options.x + this.options.limbs.head.x,
            y = this.options.y + this.options.limbs.head.y;

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = x / Settings.RATIO;
        bodyDef.position.y = y / Settings.RATIO;
        bodyDef.angle = 0;

        var shape = new Box2D.Collision.Shapes.b2CircleShape();
        shape.SetRadius(this.options.limbs.head.width / 2 / Settings.RATIO);
        shape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, 0));

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;
        fixtureDef.shape = shape;
        fixtureDef.isSensor = false;
        fixtureDef.filter.groupIndex = -this.getId();

        var head = this.body.GetWorld().CreateBody(bodyDef);
        head.CreateFixture(fixtureDef);
        
        this.limbs.head = head;

        this.attachHead();
    };

    RagDoll.prototype.attachHead = function() {
        var head = this.limbs.head;

        var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        jointDef.enableMotor = false;

        var pos = this.body.GetWorldCenter().Copy();
        pos.y -= this.options.limbs.chest.height / 2 / Settings.RATIO;
        jointDef.Initialize(this.body, head, pos);
        jointDef.lowerAngle = -0.25 * Box2D.Common.b2Settings.b2_pi; // -45 degrees
        jointDef.upperAngle = 0.25 * Box2D.Common.b2Settings.b2_pi; // 45 degrees
        jointDef.enableLimit = true;

        this.body.GetWorld().CreateJoint(jointDef);
    };

    RagDoll.prototype.addLimb = function(name, connectTo, xOffset, yOffset) {
        var x = this.options.x + this.options.limbs[name].x,
            y = this.options.y + this.options.limbs[name].y;

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = x / Settings.RATIO;
        bodyDef.position.y = y / Settings.RATIO;
        bodyDef.angle = 0;

        var shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsOrientedBox(
            this.options.limbs[name].width / 2 / Settings.RATIO,
            this.options.limbs[name].height / 2 / Settings.RATIO,
            new Box2D.Common.Math.b2Vec2(0, this.options.limbs[name].height / 2 / Settings.RATIO)
        );

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;
        fixtureDef.shape = shape;
        fixtureDef.isSensor = false;
        fixtureDef.filter.groupIndex = -this.getId();

        var limb = this.body.GetWorld().CreateBody(bodyDef);
        limb.CreateFixture(fixtureDef);
        
        this.limbs[name] = limb;

        var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        jointDef.enableMotor = false;

        var pos = connectTo.GetWorldCenter().Copy();
        pos.x += (xOffset / Settings.RATIO);
        pos.y += (yOffset / Settings.RATIO);
        jointDef.Initialize(connectTo, limb, pos);
        jointDef.lowerAngle = -0.15 * Box2D.Common.b2Settings.b2_pi; // -45 degrees
        jointDef.upperAngle = 0.15 * Box2D.Common.b2Settings.b2_pi; // 45 degrees
        jointDef.enableLimit = true;

        this.body.GetWorld().CreateJoint(jointDef);
    };

    RagDoll.prototype.detachHead = function() {
        var joint = this.limbs.head.GetJointList().joint;
        if(joint) {
            this.body.GetWorld().DestroyJoint(joint);
        }
    };

    RagDoll.prototype.reposition = function(handPosition, direction) {
        Parent.prototype.reposition.call(this, handPosition, direction);

        var chestPosition = this.body.GetPosition();

        var position = new Box2D.Common.Math.b2Vec2(
            chestPosition.x + this.options.limbs.head.x / Settings.RATIO,
            chestPosition.y + this.options.limbs.head.y / Settings.RATIO
        )
        this.limbs.head.SetPosition(position);
        this.limbs.head.SetAngle((this.options.grabAngle || 0) * direction);
    };

    RagDoll.prototype.throw = function(x, y) {
        Parent.prototype.throw.call(this, x, y);

        var limbDampingFactor = 1;

        for(var name in this.limbs) {
            var body = this.limbs[name];
            body.SetAwake(true);

            var vector = new Box2D.Common.Math.b2Vec2(
                x * Settings.MAX_THROW_FORCE * limbDampingFactor / this.options.weight,
                -y * Settings.MAX_THROW_FORCE * limbDampingFactor / this.options.weight
            );
            body.SetLinearVelocity(vector);
            // body.SetAngularVelocity(Settings.MAX_THROW_ANGULAR_VELOCITY * x);
        }
    };

    RagDoll.prototype.setVelocities = function(options) {
        this.body.SetLinearVelocity(options.linearVelocity);
        this.body.SetAngularVelocity(options.angularVelocity);
        for(var name in this.limbs) {
            this.limbs[name].SetLinearVelocity(options.linearVelocity);
        }
    };

    RagDoll.prototype.destroy = function() {

        Nc.trigger(Nc.ns.core.game.gameObject.remove, 'animated', this);
        var world = this.body.GetWorld();
        
        for (var name in this.limbs) {
            world.DestroyBody(this.limbs[name]);
        }

        Parent.prototype.destroy.call(this);
    };

    return RagDoll;
 
});