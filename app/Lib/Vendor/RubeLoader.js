define([
	"Lib/Vendor/Box2D",
], 

/*
List of what has been done here
- enclose in require.js style class
- added box2d var names
- inversed y coordinates with body positions, polygon coordinates and in getVectorValue for joints

*/

function (Box2D) {

	var b2Color = Box2D.Common.b2Color,
		b2internal = Box2D.Common.b2internal,
		b2Settings = Box2D.Common.b2Settings,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
		b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
		b2MassData = Box2D.Collision.Shapes.b2MassData,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2Shape = Box2D.Collision.Shapes.b2Shape,
		b2Mat22 = Box2D.Common.Math.b2Mat22,
		b2Mat33 = Box2D.Common.Math.b2Mat33,
		b2Math = Box2D.Common.Math.b2Math,
		b2Sweep = Box2D.Common.Math.b2Sweep,
		b2Transform = Box2D.Common.Math.b2Transform,
		b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2Vec3 = Box2D.Common.Math.b2Vec3,
		b2Body = Box2D.Dynamics.b2Body,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
		b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
		b2ContactListener = Box2D.Dynamics.b2ContactListener,
		b2ContactManager = Box2D.Dynamics.b2ContactManager,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
		b2FilterData = Box2D.Dynamics.b2FilterData,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Island = Box2D.Dynamics.b2Island,
		b2TimeStep = Box2D.Dynamics.b2TimeStep,
		b2World = Box2D.Dynamics.b2World,
		b2AABB = Box2D.Collision.b2AABB,
		b2Bound = Box2D.Collision.b2Bound,
		b2BoundValues = Box2D.Collision.b2BoundValues,
		b2Collision = Box2D.Collision.b2Collision,
		b2ContactID = Box2D.Collision.b2ContactID,
		b2ContactPoint = Box2D.Collision.b2ContactPoint,
		b2Distance = Box2D.Collision.b2Distance,
		b2DistanceInput = Box2D.Collision.b2DistanceInput,
		b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
		b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
		b2DynamicTree = Box2D.Collision.b2DynamicTree,
		b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
		b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
		b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
		b2Manifold = Box2D.Collision.b2Manifold,
		b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
		b2Point = Box2D.Collision.b2Point,
		b2RayCastInput = Box2D.Collision.b2RayCastInput,
		b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
		b2Segment = Box2D.Collision.b2Segment,
		b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
		b2Simplex = Box2D.Collision.b2Simplex,
		b2SimplexCache = Box2D.Collision.b2SimplexCache,
		b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
		b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
		b2TOIInput = Box2D.Collision.b2TOIInput,
		b2WorldManifold = Box2D.Collision.b2WorldManifold,
		ClipVertex = Box2D.Collision.ClipVertex,
		Features = Box2D.Collision.Features,
		IBroadPhase = Box2D.Collision.IBroadPhase;
		b2_dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
		b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
		IBroadPhase = Box2D.Collision.IBroadPhase,
		b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
		b2Contact = Box2D.Dynamics.Contacts.b2Contact,
		b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
		b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
		b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
		b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
		b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
		b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
		b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
		b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
		b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
		b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
		b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
		b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
		b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
		b2Controller = Box2D.Dynamics.Controllers.b2Controller,
		b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
		b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
		b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
		b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
		b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
		b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
		b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
		b2Joint = Box2D.Dynamics.Joints.b2Joint,
		b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
		b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
		b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
		b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
		b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
		b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
		b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
		b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
		b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
		b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
		b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
		b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

    function RubeLoader(json, world) {
    	
    	this.scene = this.loadSceneIntoWorld(json, world);
    }


	Object.prototype.hasOwnProperty = function(property) {
	    return typeof(this[property]) !== 'undefined'
	};

	RubeLoader.prototype.getScene = function() {
		return this.scene;
	};

	RubeLoader.prototype.loadBodyFromRUBE = function (bodyJson, world) {
	    //console.log(bodyJson);
	    
	    if ( ! bodyJson.hasOwnProperty('type') ) {
	        console.log("Body does not have a 'type' property");
	        return null;
	    }    
	    
	    var bd = new b2BodyDef();
	    if ( bodyJson.type == 2 )
	        bd.type = b2_dynamicBody;
	    else if ( bodyJson.type == 1 )
	        bd.type = b2_kinematicBody;
	    if ( bodyJson.hasOwnProperty('angle') )
	        bd.angle = bodyJson.angle;
	    if ( bodyJson.hasOwnProperty('angularVelocity') )
	        bd.angularVelocity = bodyJson.angularVelocity;
	    if ( bodyJson.hasOwnProperty('active') )
	        bd.awake = bodyJson.active;        
	    if ( bodyJson.hasOwnProperty('fixedRotation') )
	        bd.fixedRotation = bodyJson.fixedRotation;
	    if ( bodyJson.hasOwnProperty('linearVelocity') && bodyJson.linearVelocity instanceof Object )
	        bd.linearVelocity.SetV( bodyJson.linearVelocity );
	    if ( bodyJson.hasOwnProperty('position') && bodyJson.position instanceof Object )
	        bd.position.SetV( this.getVectorValue(bodyJson.position) );
	    if ( bodyJson.hasOwnProperty('awake') )
	        bd.awake = bodyJson.awake;
	    else
	        bd.awake = false;
	    var body = world.CreateBody(bd);
	    if ( bodyJson.hasOwnProperty('fixture') ) {
	        for (k = 0; k < bodyJson['fixture'].length; k++) {
	            var fixtureJson = bodyJson['fixture'][k];
	            this.loadFixtureFromRUBE(body, fixtureJson);
	        }
	    }
	    if ( bodyJson.hasOwnProperty('name') )
	        body.name = bodyJson.name;
	    if ( bodyJson.hasOwnProperty('customProperties') )
	        body.customProperties = bodyJson.customProperties;

	    return body;
	}

	RubeLoader.prototype.loadFixtureFromRUBE = function (body, fixtureJson) {
	    //console.log(fixtureJson);
	    var fd = new b2FixtureDef();
	    if (fixtureJson.hasOwnProperty('friction'))
	        fd.friction = fixtureJson.friction;
	    if (fixtureJson.hasOwnProperty('density'))
	        fd.density = fixtureJson.density;
	    if (fixtureJson.hasOwnProperty('restitution'))
	        fd.restitution = fixtureJson.restitution;
	    if (fixtureJson.hasOwnProperty('sensor'))
	        fd.isSensor = fixtureJson.sensor;
	    if ( fixtureJson.hasOwnProperty('filter-categoryBits') )
	        fd.filter.categoryBits = fixtureJson['filter-categoryBits'];
	    if ( fixtureJson.hasOwnProperty('filter-maskBits') )
	        fd.filter.maskBits = fixtureJson['filter-maskBits'];
	    if ( fixtureJson.hasOwnProperty('filter-groupIndex') )
	        fd.filter.groupIndex = fixtureJson['filter-groupIndex'];
	    if (fixtureJson.hasOwnProperty('circle')) {
	        fd.shape = new b2CircleShape();
	        fd.shape.m_radius = fixtureJson.circle.radius;
	        if ( fixtureJson.circle.center )
	            fd.shape.m_p.SetV(fixtureJson.circle.center);
	        var fixture = body.CreateFixture(fd);        
	        if ( fixtureJson.name )
	            fixture.name = fixtureJson.name;
	    }
	    else if (fixtureJson.hasOwnProperty('polygon')) {
	        fd.shape = new b2PolygonShape();
	        var verts = [];


	        for (v = fixtureJson.polygon.vertices.x.length - 1; v >= 0 ; v--) 
	           verts.push( new b2Vec2( fixtureJson.polygon.vertices.x[v], -fixtureJson.polygon.vertices.y[v] ) );
	        fd.shape.SetAsArray(verts, verts.length);
	        var fixture = body.CreateFixture(fd);        
	        if ( fixture && fixtureJson.name )
	            fixture.name = fixtureJson.name;
	    }
	    else if (fixtureJson.hasOwnProperty('chain')) {
	        fd.shape = new b2PolygonShape();
	        var lastVertex = new b2Vec2();
	        for (v =  fixtureJson.chain.vertices.x.length - 1; v >= 0; v--) {
	            var thisVertex = new b2Vec2( fixtureJson.chain.vertices.x[v], -fixtureJson.chain.vertices.y[v] );
	            if ( v < fixtureJson.chain.vertices.x.length - 1 ) {
	                fd.shape.SetAsEdge( lastVertex, thisVertex );
	                var fixture = body.CreateFixture(fd);        
	                if ( fixtureJson.name )
	                    fixture.name = fixtureJson.name;
	            }
	            lastVertex = thisVertex;
	        }
	    }
	    else {
	        console.log("Could not find shape type for fixture");
	    }
	}

	RubeLoader.prototype.getVectorValue = function (val) {
	    if ( val instanceof Object ) {
	        return { x: val.x, y: val.y * -1 };
	    } else {
	        return { x:0, y:0 };
	    }
	}

	RubeLoader.prototype.loadJointCommonProperties = function (jd, jointJson, loadedBodies) {    
	    jd.bodyA = loadedBodies[jointJson.bodyA];
	    jd.bodyB = loadedBodies[jointJson.bodyB];
	    jd.localAnchorA.SetV( this.getVectorValue(jointJson.anchorA) );
	    jd.localAnchorB.SetV( this.getVectorValue(jointJson.anchorB) );
	    if ( jointJson.collideConnected )
	        jd.collideConnected = jointJson.collideConnected;
	}

	RubeLoader.prototype.loadJointFromRUBE = function (jointJson, world, loadedBodies)
	{
	    if ( ! jointJson.hasOwnProperty('type') ) {
	        console.log("Joint does not have a 'type' property");
	        return null;
	    }    
	    if ( jointJson.bodyA >= loadedBodies.length ) {
	        console.log("Index for bodyA is invalid: " + jointJson.bodyA );
	        return null;
	    }    
	    if ( jointJson.bodyB >= loadedBodies.length ) {
	        console.log("Index for bodyB is invalid: " + jointJson.bodyB );
	        return null;
	    }
	    
	    var joint = null;
	    if ( jointJson.type == "revolute" ) {
	        var jd = new b2RevoluteJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('refAngle') )
	            jd.referenceAngle = jointJson.refAngle;
	        if ( jointJson.hasOwnProperty('lowerLimit') )
	            jd.lowerAngle = jointJson.lowerLimit;
	        if ( jointJson.hasOwnProperty('upperLimit') )
	            jd.upperAngle = jointJson.upperLimit;
	        if ( jointJson.hasOwnProperty('maxMotorTorque') )
	            jd.maxMotorTorque = jointJson.maxMotorTorque;
	        if ( jointJson.hasOwnProperty('motorSpeed') )
	            jd.motorSpeed = jointJson.motorSpeed;
	        if ( jointJson.hasOwnProperty('enableLimit') )
	            jd.enableLimit = jointJson.enableLimit;
	        if ( jointJson.hasOwnProperty('enableMotor') )
	            jd.enableMotor = jointJson.enableMotor;
	        joint = world.CreateJoint(jd);
	    }
	    else if ( jointJson.type == "distance" || jointJson.type == "rope" ) {
	        if ( jointJson.type == "rope" )
	            console.log("Replacing unsupported rope joint with distance joint!");
	        var jd = new b2DistanceJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('length') )
	            jd.length = jointJson.length;
	        if ( jointJson.hasOwnProperty('dampingRatio') )
	            jd.dampingRatio = jointJson.dampingRatio;
	        if ( jointJson.hasOwnProperty('frequency') )
	            jd.frequencyHz = jointJson.frequency;
	        joint = world.CreateJoint(jd);
	    }
	    else if ( jointJson.type == "prismatic" ) {
	        var jd = new b2PrismaticJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);        
	        if ( jointJson.hasOwnProperty('localAxisA') )
	            jd.localAxisA.SetV( this.getVectorValue(jointJson.localAxisA) );         
	        if ( jointJson.hasOwnProperty('refAngle') )
	            jd.referenceAngle = jointJson.refAngle;
	        if ( jointJson.hasOwnProperty('enableLimit') )
	            jd.enableLimit = jointJson.enableLimit;
	        if ( jointJson.hasOwnProperty('lowerLimit') )
	            jd.lowerTranslation = jointJson.lowerLimit;
	        if ( jointJson.hasOwnProperty('upperLimit') )
	            jd.upperTranslation = jointJson.upperLimit;
	        if ( jointJson.hasOwnProperty('enableMotor') )
	            jd.enableMotor = jointJson.enableMotor;
	        if ( jointJson.hasOwnProperty('maxMotorForce') )
	            jd.maxMotorForce = jointJson.maxMotorForce;
	        if ( jointJson.hasOwnProperty('motorSpeed') )
	            jd.motorSpeed = jointJson.motorSpeed;            
	        joint = world.CreateJoint(jd);
	    }
	    else if ( jointJson.type == "wheel" ) {
	        //Make a fake wheel joint using a line joint and a distance joint.
	        //Return the line joint because it has the linear motor controls.
	        //Use ApplyTorque on the bodies to spin the wheel...
	        
	        var jd = new b2DistanceJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        jd.length = 0.0;
	        if ( jointJson.hasOwnProperty('springDampingRatio') )
	            jd.dampingRatio = jointJson.springDampingRatio;
	        if ( jointJson.hasOwnProperty('springFrequency') )
	            jd.frequencyHz = jointJson.springFrequency;
	        world.CreateJoint(jd);
	        
	        jd = new b2LineJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('localAxisA') )
	            jd.localAxisA.SetV( this.getVectorValue(jointJson.localAxisA) );
	            
	        joint = world.CreateJoint(jd);
	    }
	    else if ( jointJson.type == "friction" ) {
	        var jd = new b2FrictionJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('maxForce') )
	            jd.maxForce = jointJson.maxForce;
	        if ( jointJson.hasOwnProperty('maxTorque') )
	            jd.maxTorque = jointJson.maxTorque;
	        joint = world.CreateJoint(jd);
	    }
	    else if ( jointJson.type == "weld" ) {
	        var jd = new b2WeldJointDef();
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('referenceAngle') )
	            jd.referenceAngle = jointJson.referenceAngle;
	        joint = world.CreateJoint(jd);
	    }
	    else {
	        console.log("Unsupported joint type: " + jointJson.type);
	        console.log(jointJson);
	    }
	    if ( joint && jointJson.name )
	        joint.name = jointJson.name;
	    return joint;
	}

	RubeLoader.prototype.makeClone = function (obj) {
	  var newObj = (obj instanceof Array) ? [] : {};
	  for (var i in obj) {
	    if (obj[i] && typeof obj[i] == "object") 
	      newObj[i] = this.makeClone(obj[i]);
	    else
	        newObj[i] = obj[i];
	  }
	  return newObj;
	};

	RubeLoader.prototype.loadImageFromRUBE = function (imageJson, world, loadedBodies)
	{
	    var image = this.makeClone(imageJson);
	    
	    if ( image.hasOwnProperty('body') && image.body >= 0 )
	        image.body = loadedBodies[image.body];//change index to the actual body
	    else
	        image.body = null;
	        
	    image.center = new b2Vec2();
	    image.center.SetV( this.getVectorValue(imageJson.center) );
	    
	    return image;
	}


	//load the scene into an already existing world variable
	RubeLoader.prototype.loadSceneIntoWorld = function (worldJson, world) {
	    
	    var loadedBodies = [];
	    if ( worldJson.hasOwnProperty('body') ) {
	        for (var i = 0; i < worldJson.body.length; i++) {
	            var bodyJson = worldJson.body[i];
	            var body = this.loadBodyFromRUBE(bodyJson, world);
	            if ( body )
	                loadedBodies.push( body );
	        }
	    }	    

	    
	    var loadedJoints = [];
	    if ( worldJson.hasOwnProperty('joint') ) {
	        for (var i = 0; i < worldJson.joint.length; i++) {
	            var jointJson = worldJson.joint[i];
	            var joint = this.loadJointFromRUBE(jointJson, world, loadedBodies);
	            if ( joint )
	                loadedJoints.push( joint );
	        }
	    }
	    /*
	    var loadedImages = [];
	    if ( worldJson.hasOwnProperty('image') ) {
	        for (var i = 0; i < worldJson.image.length; i++) {
	            var imageJson = worldJson.image[i];
	            var image = this.loadImageFromRUBE(imageJson, world, loadedBodies);
	            if ( image )
	                loadedImages.push( image );
	        }        
	        world.images = loadedImages;
	    }
	    */

	    var scene = {
	    	bodies: loadedBodies,
	    //	joints: loadedJoints
	    };

	    return scene;
	}

	//create a world variable and return it if loading succeeds
	RubeLoader.prototype.loadWorldFromRUBE = function (worldJson) {
	    var gravity = new b2Vec2(0,0);
	    if ( worldJson.hasOwnProperty('gravity') && worldJson.gravity instanceof Object )
	        gravity.SetV( worldJson.gravity );
	    var world = new b2World( gravity );
	    if ( ! this.loadSceneIntoWorld(worldJson, world) )
	        return false;
	    return world;
	}

	RubeLoader.prototype.getNamedBodies = function (world, name) {
	    var bodies = [];
	    for (b = world.m_bodyList; b; b = b.m_next) {
	        if ( b.name == name )
	            bodies.push(b);
	    }
	    return bodies;
	}

	RubeLoader.prototype.getNamedFixtures = function (world, name) {
	    var fixtures = [];
	    for (b = world.m_bodyList; b; b = b.m_next) {
	        for (f = b.m_fixtureList; f; f = f.m_next) {
	            if ( f.name == name )
	                fixtures.push(f);
	        }
	    }
	    return fixtures;
	}

	RubeLoader.prototype.getNamedJoints = function (world, name) {
	    var joints = [];
	    for (j = world.m_jointList; j; j = j.m_next) {
	        if ( j.name == name )
	            joints.push(j);
	    }
	    return joints;
	}

	RubeLoader.prototype.getNamedImages = function (world, name) {
	    var images = [];
	    for (i = 0; i < world.images.length; i++) {
	        if ( world.images[i].name == name )
	            images.push(world.images[i].name);
	    }
	    return images;
	}

	//custom properties
	RubeLoader.prototype.getBodiesByCustomProperty = function (world, propertyType, propertyName, valueToMatch) {
	    var bodies = [];
	    for (b = world.m_bodyList; b; b = b.m_next) {
	        if ( ! b.hasOwnProperty('customProperties') )
	            continue;
	        for (var i = 0; i < b.customProperties.length; i++) {
	            if ( ! b.customProperties[i].hasOwnProperty("name") )
	                continue;
	            if ( ! b.customProperties[i].hasOwnProperty(propertyType) )
	                continue;
	            if ( b.customProperties[i].name == propertyName &&
	                 b.customProperties[i][propertyType] == valueToMatch)
	                bodies.push(b);
	        }        
	    }
	    return bodies;
	}

	RubeLoader.prototype.hasCustomProperty = function (item, propertyType, propertyName) {
	    if ( !item.hasOwnProperty('customProperties') )
	        return false;
	    for (var i = 0; i < item.customProperties.length; i++) {
	        if ( ! item.customProperties[i].hasOwnProperty("name") )
	            continue;
	        if ( ! item.customProperties[i].hasOwnProperty(propertyType) )
	            continue;
	        return true;
	    }
	    return false;
	}

	RubeLoader.prototype.getCustomProperty = function (item, propertyType, propertyName, defaultValue) {
	    if ( !item.hasOwnProperty('customProperties') )
	        return defaultValue;
	    for (var i = 0; i < item.customProperties.length; i++) {
	        if ( ! item.customProperties[i].hasOwnProperty("name") )
	            continue;
	        if ( ! item.customProperties[i].hasOwnProperty(propertyType) )
	            continue;
	        if ( item.customProperties[i].name == propertyName )
	            return item.customProperties[i][propertyType];
	    }
	    return defaultValue;
	}


 
 
    return RubeLoader;
 
});