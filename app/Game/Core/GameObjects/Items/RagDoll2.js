define([
	"Game/" + App.context + "/GameObjects/Item",
	"Lib/Vendor/Box2D",
	"Game/Config/Settings"
],
 
function (Parent, Box2D, Settings) {

	"use strict";
 
	function RagDoll(physicsEngine, uid, options) {
		Parent.call(this, physicsEngine, uid, options);
		this.body.GetWorld().DestroyBody(this.body);
		this.limbs = {};
		this.initBodies();
	}

	RagDoll.prototype = Object.create(Parent.prototype);

	RagDoll.prototype.initBodies = function() {
		
		var world = this.body.GetWorld();

		var bodies = [];
		var joints = [];
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(-1.917114257812500e-01, 1.433728694915771e+00);
			bodies[0] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(6.299880146980286e-02, -2.545155882835388e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(6.299880146980286e-02, 2.545149326324463e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-6.299890577793121e-02, 2.545149326324463e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-6.299890577793121e-02, -2.545155882835388e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[0].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(-6.397294998168945e-02, 1.267420768737793e+00);
			bodies[1] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;
				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(1.883362084627151e-01, -4.305148720741272e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(1.846363544464111e-01, 5.393795371055603e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(1.850083470344543e-03, 5.393795371055603e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-1.883361339569092e-01, 4.209862351417542e-01);
				vs[4] = new Box2D.Common.Math.b2Vec2(-1.883361339569092e-01, -4.607573151588440e-01);
				vs[5] = new Box2D.Common.Math.b2Vec2(1.600667834281921e-03, -4.952520132064819e-01);
				shape.SetAsArray(vs, 6);

				fd.shape = shape;

				bodies[1].CreateFixture(fd);
			}
			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;
				
				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(1.840525716543198e-01, 4.875739216804504e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(1.840525716543198e-01, 6.762337088584900e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-4.607129842042923e-03, 6.762337088584900e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-4.607129842042923e-03, 4.875739216804504e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[1].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(4.118728637695312e-02, 2.199305295944214e+00);
			bodies[2] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = 2.000000029802322e-01;
				fd.restitution = 0.000000000000000e+00;
				fd.density = 2.204959988594055e-01;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2CircleShape();
				shape.m_radius = 3.009769916534424e-01;
				shape.m_p.Set(-8.219080045819283e-03, 4.109379835426807e-03);

				fd.shape = shape;

				bodies[2].CreateFixture(fd);
			}
			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = 2.000000029802322e-01;
				fd.restitution = 0.000000000000000e+00;
				fd.density = 2.204959988594055e-01;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2CircleShape();
				shape.m_radius = 2.723909914493561e-01;
				shape.m_p.Set(-3.647049888968468e-02, -1.517499983310699e-01);

				fd.shape = shape;

				bodies[2].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(1.235442161560059e-01, 1.142371892929077e+00);
			bodies[3] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(6.299892067909241e-02, -1.556134223937988e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(6.299892067909241e-02, 1.556134223937988e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-6.299898028373718e-02, 1.556134223937988e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-6.299898028373718e-02, -1.556134223937988e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[3].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(-9.663248062133789e-02, 3.554300665855408e-01);

			bodies[4] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(1.550966501235962e-01, -1.253567039966583e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(1.550966501235962e-01, -6.225190684199333e-02);
				vs[2] = new Box2D.Common.Math.b2Vec2(-9.268096834421158e-02, -6.225190684199333e-02);
				vs[3] = new Box2D.Common.Math.b2Vec2(-9.268096834421158e-02, -1.253567039966583e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[4].CreateFixture(fd);
			}
			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(9.449840337038040e-02, -1.247676759958267e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(9.449840337038040e-02, 1.715210527181625e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-9.449829906225204e-02, 1.715210527181625e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-9.449829906225204e-02, -1.247676759958267e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[4].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(-1.917138099670410e-01, 1.142371892929077e+00);

			bodies[5] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(6.299891322851181e-02, -1.556134223937988e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(6.299891322851181e-02, 1.556134223937988e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-6.299878656864166e-02, 1.556134223937988e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-6.299878656864166e-02, -1.556134223937988e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[5].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(1.235442161560059e-01, 1.433728694915771e+00);

			bodies[6] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(6.299892067909241e-02, -2.545155882835388e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(6.299892067909241e-02, 2.545149326324463e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-6.299898028373718e-02, 2.545149326324463e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-6.299898028373718e-02, -2.545155882835388e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[6].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(2.897095680236816e-02, 6.702435612678528e-01);
			bodies[7] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(9.449830651283264e-02, -2.537839412689209e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(9.449830651283264e-02, 2.537844777107239e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-9.449817240238190e-02, 2.537844777107239e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-9.449817240238190e-02, -2.537839412689209e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[7].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(-9.663248062133789e-02, 6.702435612678528e-01);

			bodies[8] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(9.449842572212219e-02, -2.537839412689209e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(9.449842572212219e-02, 2.537844777107239e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-9.449826925992966e-02, 2.537844777107239e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-9.449826925992966e-02, -2.537839412689209e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[8].CreateFixture(fd);
			}
		}
		{
			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			bd.position.Set(2.897095680236816e-02, 3.554300665855408e-01);

			bodies[9] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(1.550965905189514e-01, -1.253567039966583e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(1.550965905189514e-01, -6.225190684199333e-02);
				vs[2] = new Box2D.Common.Math.b2Vec2(-9.268099069595337e-02, -6.225190684199333e-02);
				vs[3] = new Box2D.Common.Math.b2Vec2(-9.268099069595337e-02, -1.253567039966583e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[9].CreateFixture(fd);
			}
			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = -1;
				var shape = new Box2D.Collision.Shapes.b2PolygonShape();
				var vs = [];
				vs[0] = new Box2D.Common.Math.b2Vec2(9.449830651283264e-02, -1.247680261731148e-01);
				vs[1] = new Box2D.Common.Math.b2Vec2(9.449830651283264e-02, 1.713046580553055e-01);
				vs[2] = new Box2D.Common.Math.b2Vec2(-9.449817240238190e-02, 1.713046580553055e-01);
				vs[3] = new Box2D.Common.Math.b2Vec2(-9.449817240238190e-02, -1.247680261731148e-01);
				shape.SetAsArray(vs, 4);

				fd.shape = shape;

				bodies[9].CreateFixture(fd);
			}
		}
		/*{

			ground body

			var bd = new Box2D.Dynamics.b2BodyDef();
			bd.type = b2BodyType(0);
			bd.position.Set(3.118395805358887e-03, -6.553649902343750e-03);

			bodies[10] = world.CreateBody(bd);

			{
				var fd = new Box2D.Dynamics.b2FixtureDef();
				fd.friction = Settings.PLAYER_FRICTION;
				fd.restitution = Settings.PLAYER_RESTITUTION;
				fd.density = Settings.PLAYER_DENSITY;

				fd.filter.groupIndex = int16(0);
				b2ChainShape shape;
				b2Vec2 vs[2];
				vs[0] = new Box2D.Common.Math.b2Vec2(-4.179394245147705e+00, 0.000000000000000e+00);
				vs[1] = new Box2D.Common.Math.b2Vec2(4.179394245147705e+00, 0.000000000000000e+00);
				shape.CreateChain(vs, 2);
				shape.m_prevVertex.Set(-1.998532295227051e+00, -2.391039296991059e-23);
				shape.m_nextVertex.Set(4.949933242915726e-38, 3.363116314379561e-44);
				shape.m_hasPrevVertex = false;
				shape.m_hasNextVertex = false;

				fd.shape = shape;

				bodies[10].CreateFixture(fd);
			}
		}*/
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[1];
			jd.bodyB = bodies[8];
			jd.collideConnected = false;
			jd.localAnchorA.Set(-9.128235280513763e-02, -3.880688548088074e-01);
			jd.localAnchorB.Set(-6.031601130962372e-02, 2.092975974082947e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = -6.981316804885864e-01;
			jd.upperAngle = 1.919862151145935e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[0] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[1];
			jd.bodyB = bodies[7];
			jd.collideConnected = false;
			jd.localAnchorA.Set(1.498610228300095e-01, -3.952181935310364e-01);
			jd.localAnchorB.Set(5.541206151247025e-02, 2.019590735435486e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = -6.981316804885864e-01;
			jd.upperAngle = 1.919862151145935e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[1] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[1];
			jd.bodyB = bodies[6];
			jd.collideConnected = false;
			jd.localAnchorA.Set(1.874177008867264e-01, 3.626269102096558e-01);
			jd.localAnchorB.Set(-1.000612974166870e-04, 1.963189840316772e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = false;
			jd.lowerAngle = -2.268928050994873e+00;
			jd.upperAngle = 3.141592741012573e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[2] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[1];
			jd.bodyB = bodies[0];
			jd.collideConnected = false;
			jd.localAnchorA.Set(-1.277616322040558e-01, 3.649693727493286e-01);
			jd.localAnchorB.Set(-2.339482307434082e-05, 1.986622810363770e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = false;
			jd.lowerAngle = -2.268928050994873e+00;
			jd.upperAngle = 3.141592741012573e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[3] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[8];
			jd.bodyB = bodies[4];
			jd.collideConnected = false;
			jd.localAnchorA.Set(-1.047469675540924e-03, -1.993342936038971e-01);
			jd.localAnchorB.Set(-1.047216355800629e-03, 1.156357824802399e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = -2.268928050994873e+00;
			jd.upperAngle = 0.000000000000000e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[4] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[0];
			jd.bodyB = bodies[5];
			jd.collideConnected = false;
			jd.localAnchorA.Set(1.148343086242676e-03, -1.961904764175415e-01);
			jd.localAnchorB.Set(1.148715615272522e-03, 9.516614675521851e-02);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = 0.000000000000000e+00;
			jd.upperAngle = 1.919862151145935e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[5] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[3];
			jd.bodyB = bodies[6];
			jd.collideConnected = false;
			jd.localAnchorA.Set(4.750192165374756e-04, 9.541386365890503e-02);
			jd.localAnchorB.Set(4.747509956359863e-04, -1.959429979324341e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = 0.000000000000000e+00;
			jd.upperAngle = 1.919862151145935e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[6] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[7];
			jd.bodyB = bodies[9];
			jd.collideConnected = false;
			jd.localAnchorA.Set(2.657793462276459e-03, -2.022806107997894e-01);
			jd.localAnchorB.Set(2.657927572727203e-03, 1.125320196151733e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = -2.268928050994873e+00;
			jd.upperAngle = 0.000000000000000e+00;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[7] = world.CreateJoint(jd);
		}
		{
			var jd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jd.bodyA = bodies[1];
			jd.bodyB = bodies[2];
			jd.collideConnected = false;
			jd.localAnchorA.Set(8.169807493686676e-02, 5.554057359695435e-01);
			jd.localAnchorB.Set(-2.346399985253811e-02, -3.764809966087341e-01);
			jd.referenceAngle = 0.000000000000000e+00;
			jd.enableLimit = true;
			jd.lowerAngle = -1.221730470657349e+00;
			jd.upperAngle = 6.981316804885864e-01;
			jd.enableMotor = false;
			jd.motorSpeed = 0.000000000000000e+00;
			jd.maxMotorTorque = 1.000000000000000e+00;
			joints[8] = world.CreateJoint(jd);
		}

		this.body = bodies[1];

		this.limbs = {
			head: bodies[2],
			upperLeftArm: bodies[0],
			lowerLeftArm: bodies[5],
			upperRightArm: bodies[6],
			lowerRightArm: bodies[3],
			upperLeftLeg: bodies[8],
			lowerLeftLeg: bodies[4],
			upperRightLeg: bodies[7],
			lowerRightLeg: bodies[9]
		};

		this.body.SetPosition(new Box2D.Common.Math.b2Vec2(20,0));
	};

	RagDoll.prototype.destroy = function() {
		
		var world = this.body.GetWorld();
		
		Parent.prototype.destroy.call(this); // chest destruction 

		for(var key in this.limbs) {
			world.DestroyBody(this.limbs[key]);
		}
	};

	return RagDoll;

});