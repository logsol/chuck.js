define([
    "Lib/Vendor/Planck",
], 

/*
List of what has been done here
- enclose in require.js style class
- added planck var names
- inversed y coordinates with body positions, polygon coordinates and in getVectorValue for joints
- migrated from Box2D to Planck.js

*/

function (planck) {

    // Planck.js equivalents for Box2D classes
    var Vec2 = planck.Vec2,
        Body = planck.Body,
        Fixture = planck.Fixture,
        Circle = planck.Circle,
        Polygon = planck.Polygon,
        Edge = planck.Edge,
        Chain = planck.Chain,
        RevoluteJoint = planck.RevoluteJoint,
        DistanceJoint = planck.DistanceJoint,
        PrismaticJoint = planck.PrismaticJoint,
        FrictionJoint = planck.FrictionJoint,
        WeldJoint = planck.WeldJoint;

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
	    
	    var bodyDef = {};
	    if ( bodyJson.type == 2 )
	        bodyDef.type = 'dynamic';
	    else if ( bodyJson.type == 1 )
	        bodyDef.type = 'kinematic';
	    if ( bodyJson.hasOwnProperty('angle') )
	        bodyDef.angle = bodyJson.angle;
	    if ( bodyJson.hasOwnProperty('angularVelocity') )
	        bodyDef.angularVelocity = bodyJson.angularVelocity;
	    if ( bodyJson.hasOwnProperty('active') )
	        bodyDef.awake = bodyJson.active;        
	    if ( bodyJson.hasOwnProperty('fixedRotation') )
	        bodyDef.fixedRotation = bodyJson.fixedRotation;
	    if ( bodyJson.hasOwnProperty('linearVelocity') && bodyJson.linearVelocity instanceof Object )
	        bodyDef.linearVelocity = Vec2(bodyJson.linearVelocity.x, bodyJson.linearVelocity.y);
	    if ( bodyJson.hasOwnProperty('position') && bodyJson.position instanceof Object )
	        bodyDef.position = this.getVectorValue(bodyJson.position);
	    if ( bodyJson.hasOwnProperty('awake') )
	        bodyDef.awake = bodyJson.awake;
	    else
	        bodyDef.awake = false;
	    var body = world.createBody(bodyDef);
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
	    var fixtureDef = {};
	    if(fixtureJson.hasOwnProperty('friction'))
	        fixtureDef.friction = fixtureJson.friction;
	    if(fixtureJson.hasOwnProperty('density'))
	        fixtureDef.density = fixtureJson.density;
	    if(fixtureJson.hasOwnProperty('restitution'))
	        fixtureDef.restitution = fixtureJson.restitution;
	    if(fixtureJson.hasOwnProperty('sensor'))
	        fixtureDef.isSensor = fixtureJson.sensor;
	    if ( fixtureJson.hasOwnProperty('filter-categoryBits') )
	        fixtureDef.filterCategoryBits = fixtureJson['filter-categoryBits'];
	    if ( fixtureJson.hasOwnProperty('filter-maskBits') )
	        fixtureDef.filterMaskBits = fixtureJson['filter-maskBits'];
	    if ( fixtureJson.hasOwnProperty('filter-groupIndex') )
	        fixtureDef.filterGroupIndex = fixtureJson['filter-groupIndex'];
	    if(fixtureJson.hasOwnProperty('circle')) {
	        fixtureDef.shape = Circle(fixtureJson.circle.radius);
	        if ( fixtureJson.circle.center )
	            fixtureDef.shape.m_center = Vec2(fixtureJson.circle.center.x, fixtureJson.circle.center.y);
	        var fixture = body.createFixture(fixtureDef);        
	        if ( fixture && fixtureJson.name )
	            fixture.name = fixtureJson.name;
	    }
	    else if (fixtureJson.hasOwnProperty('polygon')) {
	        var verts = [];

	        for (v = fixtureJson.polygon.vertices.x.length - 1; v >= 0 ; v--) 
	           verts.push( Vec2( fixtureJson.polygon.vertices.x[v], -fixtureJson.polygon.vertices.y[v] ) );
	        fixtureDef.shape = Polygon(verts);
	        var fixture = body.createFixture(fixtureDef);        
	        if ( fixture && fixtureJson.name )
	            fixture.name = fixtureJson.name;
	    }
	    else if (fixtureJson.hasOwnProperty('chain')) {
	        var verts = [];
	        for (v =  fixtureJson.chain.vertices.x.length - 1; v >= 0; v--) {
	            var thisVertex = Vec2( fixtureJson.chain.vertices.x[v], -fixtureJson.chain.vertices.y[v] );
	            verts.push(thisVertex);
	        }
	        fixtureDef.shape = Chain(verts);
	        var fixture = body.createFixture(fixtureDef);        
	        if ( fixtureJson.name )
	            fixture.name = fixtureJson.name;
	    }
	    else {
	        console.log("Could not find shape type for fixture");
	    }
	}

	RubeLoader.prototype.getVectorValue = function (val) {
	    if ( val instanceof Object ) {
	        return Vec2(val.x, val.y * -1);
	    } else {
	        return Vec2(0, 0);
	    }
	}

	RubeLoader.prototype.loadJointCommonProperties = function (jd, jointJson, loadedBodies) {    
	    jd.bodyA = loadedBodies[jointJson.bodyA];
	    jd.bodyB = loadedBodies[jointJson.bodyB];
	    jd.localAnchorA = this.getVectorValue(jointJson.anchorA);
	    jd.localAnchorB = this.getVectorValue(jointJson.anchorB);
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
	        var jd = {};
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
	        joint = world.createJoint(RevoluteJoint(jd));
	    }
	    else if ( jointJson.type == "distance" || jointJson.type == "rope" ) {
	        if ( jointJson.type == "rope" )
	            console.log("Replacing unsupported rope joint with distance joint!");
	        var jd = {};
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('length') )
	            jd.length = jointJson.length;
	        if ( jointJson.hasOwnProperty('dampingRatio') )
	            jd.dampingRatio = jointJson.dampingRatio;
	        if ( jointJson.hasOwnProperty('frequency') )
	            jd.frequencyHz = jointJson.frequency;
	        joint = world.createJoint(DistanceJoint(jd));
	    }
	    else if ( jointJson.type == "prismatic" ) {
	        var jd = {};
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);        
	        if ( jointJson.hasOwnProperty('localAxisA') )
	            jd.localAxisA = this.getVectorValue(jointJson.localAxisA);         
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
	        joint = world.createJoint(PrismaticJoint(jd));
	    }
	    else if ( jointJson.type == "wheel" ) {
	        //Make a fake wheel joint using a distance joint and a prismatic joint.
	        //Return the prismatic joint because it has the linear motor controls.
	        //Use ApplyTorque on the bodies to spin the wheel...
	        
	        var jd = {};
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        jd.length = 0.0;
	        if ( jointJson.hasOwnProperty('springDampingRatio') )
	            jd.dampingRatio = jointJson.springDampingRatio;
	        if ( jointJson.hasOwnProperty('springFrequency') )
	            jd.frequencyHz = jointJson.springFrequency;
	        world.createJoint(DistanceJoint(jd));
	        
	        jd = {};
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('localAxisA') )
	            jd.localAxisA = this.getVectorValue(jointJson.localAxisA);
	            
	        joint = world.createJoint(PrismaticJoint(jd));
	    }
	    else if ( jointJson.type == "friction" ) {
	        var jd = {};
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('maxForce') )
	            jd.maxForce = jointJson.maxForce;
	        if ( jointJson.hasOwnProperty('maxTorque') )
	            jd.maxTorque = jointJson.maxTorque;
	        joint = world.createJoint(FrictionJoint(jd));
	    }
	    else if ( jointJson.type == "weld" ) {
	        var jd = {};
	        this.loadJointCommonProperties(jd, jointJson, loadedBodies);
	        if ( jointJson.hasOwnProperty('referenceAngle') )
	            jd.referenceAngle = jointJson.referenceAngle;
	        joint = world.createJoint(WeldJoint(jd));
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
	        
	    image.center = this.getVectorValue(imageJson.center);
	    
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
	    	joints: loadedJoints
	    };

	    return scene;
	}

	//create a world variable and return it if loading succeeds
	RubeLoader.prototype.loadWorldFromRUBE = function (worldJson) {
	    var gravity = Vec2(0,0);
	    if ( worldJson.hasOwnProperty('gravity') && worldJson.gravity instanceof Object )
	        gravity = Vec2(worldJson.gravity.x, worldJson.gravity.y);
	    var world = planck.World({ gravity: gravity });
	    if ( ! this.loadSceneIntoWorld(worldJson, world) )
	        return false;
	    return world;
	}

	RubeLoader.prototype.getNamedBodies = function (world, name) {
	    var bodies = [];
	    var bodyList = world.getBodyList();
	    for (var b = bodyList; b; b = b.getNext()) {
	        if ( b.name == name )
	            bodies.push(b);
	    }
	    return bodies;
	}

	RubeLoader.prototype.getNamedFixtures = function (world, name) {
	    var fixtures = [];
	    var bodyList = world.getBodyList();
	    for (var b = bodyList; b; b = b.getNext()) {
	        var fixtureList = b.getFixtureList();
	        for (var f = fixtureList; f; f = f.getNext()) {
	            if ( f.name == name )
	                fixtures.push(f);
	        }
	    }
	    return fixtures;
	}

	RubeLoader.prototype.getNamedJoints = function (world, name) {
	    var joints = [];
	    var jointList = world.getJointList();
	    for (var j = jointList; j; j = j.getNext()) {
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
	    var bodyList = world.getBodyList();
	    for (var b = bodyList; b; b = b.getNext()) {
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