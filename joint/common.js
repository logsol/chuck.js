var bodiesNum = 3;
var world;
var body;
var item;


var	b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2AABB = Box2D.Collision.b2AABB,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
	b2ContactListener =  Box2D.Dynamics.b2ContactListener,
	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

function setupWorld(gravity) {
	world = new b2World(new b2Vec2(0, gravity), true);

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.99;
	fixDef.restitution = .51;
		 
	var bodyDef = new b2BodyDef;
		 
	// create ground
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(20, 2);

	bodyDef.position.Set(10, 400 / 30 + 1.8);

	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(10, -1.8);

	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(2, 14);

	bodyDef.position.Set(-1.8, 13);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.position.Set(21.8, 13);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	// create some objects
	
	
	dude = makeBody(.2, .6,   2, 12, true,    3).GetBody();
	item = makeBody(.2, .2, 1.8, 11.5, false, 1).GetBody();

	
	var jointDef = new b2RevoluteJointDef();
	jointDef.Initialize(dude, item, dude.GetWorldCenter());

	jointDef.lowerAngle     = -0.5 * Math.PI; // -90 degrees
	jointDef.upperAngle     = 0.25 * Math.PI; // 45 degrees
	jointDef.enableLimit    = true;

	world.CreateJoint(jointDef);


	/*
	jointDef.maxMotorTorque = 10.0;
	jointDef.motorSpeed     = 0.0;
	jointDef.enableMotor    = true;
	*/
}

function makeBody(width, height, x, y, fixedRotation, mass){

	var fixDef = new b2FixtureDef;
	fixDef.density = mass;
	fixDef.friction = 0.99;
	fixDef.restitution = .51;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(width, height);

	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = x;
	bodyDef.position.y = y;
	bodyDef.fixedRotation = fixedRotation;

	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function jump(body) {
	body.SetAwake(true);
	body.ApplyImpulse(new b2Vec2(2, -3), body.GetPosition());
}