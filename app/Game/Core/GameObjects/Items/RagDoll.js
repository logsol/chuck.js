define([
	"Game/" + GLOBALS.context + "/GameObjects/Item",
	"Lib/Vendor/Box2D",
	"Game/Config/Settings"
],
 
function (Parent, Box2D, Settings) {
 
    function RagDoll(physicsEngine, uid, options) {

        // Sensor size
        options.width = 20;
        options.height = 40;

        options.limbs = {};
        options.limbs.chest = {
            width: 6,
            height: 12,
            x: 0,
            y: 0
        };

        options.limbs.head = {
            width: 10,
            height: 12,
            x: 0,
            y: - options.limbs.chest.height / 2 - 5
        };

        Parent.call(this, physicsEngine, uid, options);
        this.createSensor();

        this.limbs = {
            head: null
        };
    	this.addHead();

    }

    RagDoll.prototype = Object.create(Parent.prototype);

    RagDoll.prototype.getId = function() {
        return 1; parseInt(this.uid.split("-")[1], 10);
    };

    RagDoll.prototype.getBodyDef = function() {
        var bodyDef = Parent.prototype.getBodyDef.call(this);
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        //bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
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

    RagDoll.prototype.destroy = function() {
    	Parent.prototype.destroy.call(this);
    	// remove head!!11
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
        var chestPosition = this.body.GetPosition();
        
        var x = chestPosition.x + this.options.limbs.head.x / Settings.RATIO,
            y = chestPosition.y + this.options.limbs.head.y / Settings.RATIO;

        var head = this.limbs.head;
        head.SetPosition(new Box2D.Common.Math.b2Vec2(x, y));
        head.SetAngle(0);

        var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        jointDef.enableMotor = false;

        var point = chestPosition;
        //point.y -= this.options.limbs.chest.height / 2 / Settings.RATIO;
        jointDef.Initialize(this.body, head, point);
        jointDef.lowerAngle = -0.25 * Box2D.Common.b2Settings.b2_pi; // -45 degrees
        jointDef.upperAngle = 0.25 * Box2D.Common.b2Settings.b2_pi; // 45 degrees
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
            /*
            body.ApplyImpulse(
                new Box2D.Common.Math.b2Vec2(
                    x * Settings.MAX_THROW_FORCE * limbDampingFactor,
                    -y * Settings.MAX_THROW_FORCE * 1.5 *limbDampingFactor // 1.5 is to throw higher then far
                ),
                body.GetLocalCenter()
            );
            */

            var vector = new Box2D.Common.Math.b2Vec2(
                x * Settings.MAX_THROW_FORCE * limbDampingFactor,
                -y * Settings.MAX_THROW_FORCE * 1.5 *limbDampingFactor // 1.5 is to throw higher then far
            );
            this.body.SetLinearVelocity(vector);
            // body.SetAngularVelocity(Settings.MAX_THROW_ANGULAR_VELOCITY * x);
        }
    };

    return RagDoll;
 
});