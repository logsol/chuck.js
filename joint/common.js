var bodiesNum = 3;
var world;


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
	b2ContactListener =  Box2D.Dynamics.b2ContactListener;

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
	
	
	var b1 = makeBox(2,3);
	var b2 = makeBox(3,3);


	
}

function makeBox(x, y){

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.99;
	fixDef.restitution = .51;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(0.5, 0.5);

	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = x;
	bodyDef.position.y = y;

	world.CreateBody(bodyDef).CreateFixture(fixDef);

	return bodyDef;
}

function jump() {
	var body = findBody(1);
	body.SetAwake(true);
	body.ApplyImpulse(new b2Vec2(8, -15), body.GetPosition());
	body.SetAngularVelocity(1.5);
}