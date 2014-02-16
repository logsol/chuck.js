
//Having to type 'Box2D.' in front of everything makes porting
//existing C++ code a pain in the butt. This function can be used
//to make everything in the Box2D namespace available without
//needing to do that.
/*function using(ns, pattern) {    
    if (pattern == undefined) {
        // import all
        for (var name in ns) {
            //console.log(this[name]);
            this[name] = ns[name];
        }
    } else {
        if (typeof(pattern) == 'string') {
            pattern = new RegExp(pattern);
        }
        // import only stuff matching given pattern
        for (var name in ns) {
            //console.log(name);
            if (name.match(pattern)) {
                //console.log(ns[name]);
                this[name] = ns[name];
            }
        }       
    }
}*/

var e_shapeBit = 0x0001;
var e_jointBit = 0x0002;
var e_aabbBit = 0x0004;
var e_pairBit = 0x0008;
var e_centerOfMassBit = 0x0010;

var PTM = 32;

var world = null;
var mouseJointGroundBody;
var canvas;
var context;
var myDebugDraw;        
var mouseDownQueryCallback;
var visibleFixturesQueryCallback;
var mouseJoint = null;        
var run = true;
var frameTime60 = 0;
var statusUpdateCounter = 0;
var showStats = false;        
var mouseDown = false;
var shiftDown = false;
var originTransform;
var mousePosPixel = {
    x: 0,
    y: 0
};
var prevMousePosPixel = {
    x: 0,
    y: 0
};        
var mousePosWorld = {
    x: 0,
    y: 0
};        
var canvasOffset = {
    x: 0,
    y: 0
};        
var viewCenterPixel = {
    x:320,
    y:240
};
var viewAABB;

function myRound(val,places) {
    var c = 1;
    for (var i = 0; i < places; i++)
        c *= 10;
    return Math.round(val*c)/c;
}
        
function getWorldPointFromPixelPoint(pixelPoint) {
    return {                
        x: (pixelPoint.x - canvasOffset.x)/PTM,
        y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
    };
}

function updateMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mousePosPixel = {
        x: evt.clientX - rect.left,
        y: canvas.height - (evt.clientY - rect.top)
    };
    mousePosWorld = getWorldPointFromPixelPoint(mousePosPixel);
}

function setViewCenterWorld(b2vecpos, instantaneous) {
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    var toMoveX = b2vecpos.x - currentViewCenterWorld.x;
    var toMoveY = b2vecpos.y - currentViewCenterWorld.y;
    var fraction = instantaneous ? 1 : 0.25;
    canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
    canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
}

function onMouseMove(canvas, evt) {
    prevMousePosPixel = mousePosPixel;
    updateMousePos(canvas, evt);
    updateStats();
    if ( shiftDown ) {
        canvasOffset.x += (mousePosPixel.x - prevMousePosPixel.x);
        canvasOffset.y -= (mousePosPixel.y - prevMousePosPixel.y);
        draw();
    }
    else if ( mouseDown && mouseJoint != null ) {
        mouseJoint.SetTarget( new b2Vec2(mousePosWorld.x, mousePosWorld.y) );
    }
}

var getBodyCB = function(fixture) {
    if(fixture.GetBody().GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
        if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePosWorld)) {
            selectedBody = fixture.GetBody();
            return false;
        }
    }
    return true;
};

function startMouseJoint() {
    
    if ( mouseJoint != null )
        return;
    
    // Make a small box.
    var aabb = new b2AABB();
    var d = 0.001;            
    aabb.lowerBound.Set(mousePosWorld.x - d, mousePosWorld.y - d);
    aabb.upperBound.Set(mousePosWorld.x + d, mousePosWorld.y + d);
    
    // Query the world for overlapping shapes.            
    mouseDownQueryCallback.m_fixture = null;
    mouseDownQueryCallback.m_point.Set(mousePosWorld.x, mousePosWorld.y);
    world.QueryAABB(mouseDownQueryCallback, aabb);
    if (mouseDownQueryCallback.m_fixture)
    {
        var body = mouseDownQueryCallback.m_fixture.GetBody();
        
    /*selectedBody = null;
    world.QueryAABB(getBodyCB, aabb);    
    if (selectedBody)    
    {
        var body = selectedBody;*/
        var md = new b2MouseJointDef();
        md.bodyA = mouseJointGroundBody;
        md.bodyB = body;
        md.target.Set(mousePosWorld.x, mousePosWorld.y);
        md.maxForce = 1000 * body.GetMass();
        md.collideConnected = true;
        
        mouseJoint = world.CreateJoint(md);
        body.SetAwake(true);
    }
}

function onMouseDown(canvas, evt) {            
    updateMousePos(canvas, evt);
    if ( !mouseDown )
        startMouseJoint();
    mouseDown = true;
    updateStats();
}

function onMouseUp(canvas, evt) {
    mouseDown = false;
    updateMousePos(canvas, evt);
    updateStats();
    if ( mouseJoint != null ) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = null;
    }
}

function onMouseOut(canvas, evt) {
    onMouseUp(canvas,evt);
}

function onKeyDown(canvas, evt) {
    //console.log(evt.keyCode);
    if ( evt.keyCode == 80 ) {//p
        pause();
    }
    else if ( evt.keyCode == 82 ) {//r
        resetScene();
    }
    else if ( evt.keyCode == 83 ) {//s
        step();
    }
    else if ( evt.keyCode == 88 ) {//x
        zoomIn();
    }
    else if ( evt.keyCode == 90 ) {//z
        zoomOut();
    }
    else if ( evt.keyCode == 37 ) {//left
        canvasOffset.x += 32;
    }
    else if ( evt.keyCode == 39 ) {//right
        canvasOffset.x -= 32;
    }
    else if ( evt.keyCode == 38 ) {//up
        canvasOffset.y += 32;
    }
    else if ( evt.keyCode == 40 ) {//down
        canvasOffset.y -= 32;
    }
    else if ( evt.keyCode == 16 ) {//shift
        shiftDown = true;
    }
    
    if ( window['currentTest'] && window['currentTest']['onKeyDown'] )
        window['currentTest']['onKeyDown'](canvas, evt);
    
    draw();
}

function onKeyUp(canvas, evt) {
    if ( evt.keyCode == 16 ) {//shift
        shiftDown = false;
    }
    
    if ( window['currentTest'] && window['currentTest']['onKeyUp'] )
        window['currentTest']['onKeyUp'](canvas, evt);
}

function zoomIn() {
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    PTM *= 1.1;
    var newViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
    canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
    draw();
}

function zoomOut() {
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    PTM /= 1.1;
    var newViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
    canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
    draw();
}
        
function updateDebugDrawCheckboxesFromWorld() {
    var flags = myDebugDraw.GetFlags();
    document.getElementById('drawShapesCheck').checked = (( flags & e_shapeBit ) != 0);
    document.getElementById('drawJointsCheck').checked = (( flags & e_jointBit ) != 0);
    document.getElementById('drawAABBsCheck').checked = (( flags & e_aabbBit ) != 0);
    //document.getElementById('drawPairsCheck').checked = (( flags & e_pairBit ) != 0);
    document.getElementById('drawTransformsCheck').checked = (( flags & e_centerOfMassBit ) != 0);
}

function updateWorldFromDebugDrawCheckboxes() {
    var flags = 0;
    if ( document.getElementById('drawShapesCheck').checked )
        flags |= e_shapeBit;
    if ( document.getElementById('drawJointsCheck').checked )
        flags |= e_jointBit;
    if ( document.getElementById('drawAABBsCheck').checked )
        flags |= e_aabbBit;
    /*if ( document.getElementById('drawPairsCheck').checked )
        flags |= e_pairBit;*/
    if ( document.getElementById('drawTransformsCheck').checked )
        flags |= e_centerOfMassBit;
    myDebugDraw.SetFlags( flags );
}

function updateContinuousRefreshStatus() {
    showStats = ( document.getElementById('showStatsCheck').checked );
    if ( !showStats ) {
        var fbSpan = document.getElementById('feedbackSpan');
        fbSpan.innerHTML = "";
    }
    else
        updateStats();
}

function init() {
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext( '2d' );
    
    canvasOffset.x = canvas.width/2;
    canvasOffset.y = canvas.height/2;
    
    canvas.addEventListener('mousemove', function(evt) {
        onMouseMove(canvas,evt);
    }, false);
    
    canvas.addEventListener('mousedown', function(evt) {
        onMouseDown(canvas,evt);
    }, false);
    
    canvas.addEventListener('mouseup', function(evt) {
        onMouseUp(canvas,evt);
    }, false);
    
    canvas.addEventListener('mouseout', function(evt) {
        onMouseOut(canvas,evt);
    }, false);
    
    canvas.addEventListener('keydown', function(evt) {
        onKeyDown(canvas,evt);
    }, false);
    
    canvas.addEventListener('keyup', function(evt) {
        onKeyUp(canvas,evt);
    }, false);
    
    myDebugDraw = new b2DebugDraw();
    myDebugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    myDebugDraw.SetDrawScale(1.0);
    myDebugDraw.SetFillAlpha(0.5);
    myDebugDraw.SetLineThickness(1.0);
    myDebugDraw.SetXFormScale(0.25);
    myDebugDraw.SetFlags(b2DebugDraw.e_shapeBit /*| b2DebugDraw.e_jointBit*/);
    
    originTransform = new b2Transform();
    
    var MouseDownQueryCallback = function() {
        this.m_fixture = null;
        this.m_point = new b2Vec2();
    }
    MouseDownQueryCallback.prototype.ReportFixture = function(fixture) {
        if(fixture.GetBody().GetType() == 2) { //dynamic bodies only
            if ( fixture.TestPoint(this.m_point) ) {
                this.m_fixture = fixture;
                return false;
            }
        }
        return true;
    };
    
    mouseDownQueryCallback = new MouseDownQueryCallback();
      
    
    var VisibleFixturesQueryCallback = function() {
        this.m_fixtures = [];
    }
    VisibleFixturesQueryCallback.prototype.ReportFixture = function(fixture) {
        this.m_fixtures.push(fixture);
        return true;
    };
    
    viewAABB = new b2AABB();
    visibleFixturesQueryCallback = new VisibleFixturesQueryCallback();
}

function changeTest() {    
    resetScene();
    if ( window['currentTest'] && window['currentTest']['setNiceViewCenter'] )
        window['currentTest']['setNiceViewCenter']();
    updateDebugDrawCheckboxesFromWorld();
    draw();
}

function createWorld() {
    
    var sceneInfoDiv = document.getElementById('sceneinfo');
    var commentsDiv = document.getElementById('testcomments');
    sceneInfoDiv.innerHTML = "Loading...";
    commentsDiv.innerHTML = "";
    
    if ( world != null ) 
        //Box2D.destroy(world);
        world = null;
        
    world = new b2World( new b2Vec2(0.0, -10.0) );
    //world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 9.8) /* gravity */, true /* allowSleep */);
    world.SetDebugDraw(myDebugDraw);
    
    mouseJointGroundBody = world.CreateBody( new b2BodyDef() );
    
    var e = document.getElementById("testSelection");
    var v = e.options[e.selectedIndex].value;
    
    eval( "window['currentTest']= new "+v+"();" );
    
    window['currentTest']['setup']();
}

function getWorldInfo() {
    var numBodies = 0;
    var numFixtures = 0;
    var numJoints = 0;
    for (b = world.m_bodyList; b; b = b.m_next) {
        numBodies++;
        for (f = b.m_fixtureList; f; f = f.m_next) 
            numFixtures++;
    }
    for (j = world.m_jointList; j; j = j.m_next) 
        numJoints++;
    return ""+numBodies+" bodies, "+numFixtures+" fixtures, "+numJoints+" joints";
}

var resettingScene = false;
function resetScene() {
    resettingScene = true;
    createWorld();
    draw();
}

//the RUBE scenes are loaded via jQuery post, so the draw() call above usually
//does not catch them. Call this at the end of the post function.
function doAfterLoading() {
    
    if ( world.images ) {
        for (var i = 0; i < world.images.length; i++) {
            var imageObj = new Image();
            imageObj.src = world.images[i].file;
            world.images[i].imageObj = imageObj;
        }
    }
    
    var sceneInfoDiv = document.getElementById('sceneinfo');
    sceneInfoDiv.innerHTML = "Scene info: "+getWorldInfo();;
    
    var comments = "";
    if ( window['currentTest']['getComments'] )
        comments = window['currentTest']['getComments']();
    var commentsDiv = document.getElementById('testcomments');
    commentsDiv.innerHTML = "About: "+comments;
    
    resettingScene = false;
    
    draw();
}

function step(timestamp) {
    
    if ( resettingScene )
        return;
    
    if ( window['currentTest'] && window['currentTest']['step'] ) 
        window['currentTest']['step']();
    
    if ( ! showStats ) {
        world.Step(1/60, 10, 6);
        draw();
        //logBodyPositions();
        return;
    }
    
    var current = Date.now();
    world.Step(1/60, 10, 6);
    var frametime = (Date.now() - current);
    frameTime60 = frameTime60 * (59/60) + frametime * (1/60);
    
    draw();
    statusUpdateCounter++;
    if ( statusUpdateCounter > 20 ) {
        updateStats();
        statusUpdateCounter = 0;
    }
}

function setColorFromBodyType(color, b) {
    if (b.IsActive() == false) 
        color.Set(0.5, 0.5, 0.3);
     else if (b.GetType() == b2_staticBody) 
        color.Set(0.5, 0.9, 0.5);
     else if (b.GetType() == b2_kinematicBody) 
        color.Set(0.5, 0.5, 0.9);
     else if (b.IsAwake() == false) 
        color.Set(0.6, 0.6, 0.6);                
     else 
        color.Set(0.9, 0.7, 0.7);
}

//for drawing polygons as one path
function drawLinePolygon(poly, xf) {
    var vertexCount = parseInt(poly.GetVertexCount());
    var localVertices = poly.GetVertices();
    var vertices = new Vector(vertexCount);
    for (var i = 0; i < vertexCount; ++i) {
        vertices[i] = b2Math.MulX(xf, localVertices[i]);
    }
    var drawScale = myDebugDraw.m_drawScale;
    context.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
    for (var i = 1; i < vertexCount; i++) {
        context.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
    }
    context.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
}

function draw() {
    
    //black background
    context.fillStyle = 'rgb(0,0,0)';
    context.fillRect( 0, 0, canvas.width, canvas.height );
    
    context.save();   
        context.translate(canvasOffset.x, canvasOffset.y);
        context.scale(1,-1);
        context.scale(PTM,PTM);
        context.lineWidth /= PTM;
        
        //draw images
        context.save();
            context.scale(1,-1);
            if ( world.images ) {
                for (var i = 0; i < world.images.length; i++) {
                    var imageObj = world.images[i].imageObj;
                    context.save();
                        if ( world.images[i].body ) {
                            //body position in world
                            var bodyPos = world.images[i].body.GetPosition();
                            context.translate(bodyPos.x, -bodyPos.y);
                            context.rotate(-world.images[i].body.GetAngle());
                            
                            //image position in body
                            var imageLocalCenter = world.images[i].center;
                            context.translate(imageLocalCenter.x, -imageLocalCenter.y);
                            context.rotate(-world.images[i].angle);
                        }
                        var ratio = 1 / imageObj.height;
                        ratio *= world.images[i].scale;
                        context.scale(ratio, ratio);
                        context.translate(-imageObj.width / 2, -imageObj.height / 2);
                        context.drawImage(imageObj, 0, 0);
                    context.restore();
                }
            }
        context.restore();
        
        myDebugDraw.DrawTransform(originTransform);
        
        var flags = myDebugDraw.GetFlags();
        myDebugDraw.SetFlags(flags & ~e_shapeBit);
        world.DrawDebugData();
        myDebugDraw.SetFlags(flags);
                
        if (( flags & e_shapeBit ) != 0) {
            //query the world for visible fixtures
            var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
            var viewHalfwidth = 0.5 * canvas.width / PTM;
            var viewHalfheight = 0.5 * canvas.height / PTM;
            viewAABB.lowerBound.Set(currentViewCenterWorld.x - viewHalfwidth, currentViewCenterWorld.y - viewHalfheight);
            viewAABB.upperBound.Set(currentViewCenterWorld.x + viewHalfwidth, currentViewCenterWorld.y + viewHalfheight);
            visibleFixturesQueryCallback.m_fixtures = [];
            world.QueryAABB(visibleFixturesQueryCallback, viewAABB);
            var f, b, xf, s;
            var color = new b2Color(0, 0, 0);            
            var circleFixtures = [];
            var polygonFixtures = [];
            var staticPolygonFixtures = [];
            var kinematicPolygonFixtures = [];
            var dynamicPolygonFixtures = [];
            for (var i = 0; i < visibleFixturesQueryCallback.m_fixtures.length; i++) {
                f = visibleFixturesQueryCallback.m_fixtures[i];
                s = f.GetShape();
                if ( s.GetType() == b2Shape.e_circleShape ) {
                    circleFixtures.push(f);
                }
                else if ( s.GetType() == b2Shape.e_polygonShape ) {
                    polygonFixtures.push(f);
                }
            }
            for (var i = 0; i < circleFixtures.length; i++) {
                f = circleFixtures[i];
                s = f.GetShape();
                b = f.GetBody();
                xf = b.GetTransform();
                setColorFromBodyType(color, b);
                world.DrawShape(s, xf, color);
            }
            for (var i = 0; i < polygonFixtures.length; i++) {
                f = polygonFixtures[i];
                b = f.GetBody();
                if (b.GetType() == b2_staticBody) 
                    staticPolygonFixtures.push(f);
                else if (b.GetType() == b2_kinematicBody) 
                    kinematicPolygonFixtures.push(f);
                else 
                    dynamicPolygonFixtures.push(f);
            }
            context.strokeStyle = "rgb(128,230,128)";
            context.beginPath();//draw all static polygons as one path
            for (var i = 0; i < staticPolygonFixtures.length; i++) {
                f = staticPolygonFixtures[i];
                s = f.GetShape();
                b = f.GetBody();
                xf = b.GetTransform();
                //world.DrawShape(s, xf, color);
                drawLinePolygon(s, xf);
            }
            context.closePath();
            context.stroke();
            
            context.strokeStyle = "rgb(128,128,230)";
            context.beginPath();//draw all kinematic polygons as one path
            for (var i = 0; i < kinematicPolygonFixtures.length; i++) {
                f = kinematicPolygonFixtures[i];
                s = f.GetShape();
                b = f.GetBody();
                xf = b.GetTransform();
                //world.DrawShape(s, xf, color);
                drawLinePolygon(s, xf);
            }
            context.closePath();
            context.stroke();
            
            context.strokeStyle = "rgb(230,178,178)";
            context.beginPath();//draw all dynamic polygons as one path
            for (var i = 0; i < dynamicPolygonFixtures.length; i++) {
                f = dynamicPolygonFixtures[i];
                s = f.GetShape();
                b = f.GetBody();
                xf = b.GetTransform();
                //world.DrawShape(s, xf, color);
                drawLinePolygon(s, xf);
            }
            context.closePath();
            context.stroke();
        }
        
        if ( mouseJoint != null ) {
            //mouse joint is not drawn with regular joints in debug draw
            var p1 = mouseJoint.GetAnchorB();
            var p2 = mouseJoint.GetTarget();
            context.strokeStyle = 'rgb(204,204,204)';
            context.beginPath();
            context.moveTo(p1.x,p1.y);
            context.lineTo(p2.x,p2.y);
            context.stroke();
        }
        
    context.restore();
}

function updateStats() {
    if ( ! showStats )
        return;
    var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
    var fbSpan = document.getElementById('feedbackSpan');
    fbSpan.innerHTML =
        "Status: "+(run?'running':'paused') +
        "<br>Physics step time (average of last 60 steps): "+myRound(frameTime60,2)+"ms" +
        //"<br>Mouse down: "+mouseDown +
        "<br>PTM: "+myRound(PTM,2) +
        "<br>View center: "+myRound(currentViewCenterWorld.x,3)+", "+myRound(currentViewCenterWorld.y,3) +
        //"<br>Canvas offset: "+myRound(canvasOffset.x,0)+", "+myRound(canvasOffset.y,0) +
        "<br>Mouse pos (pixel): "+mousePosPixel.x+", "+mousePosPixel.y +
        "<br>Mouse pos (world): "+myRound(mousePosWorld.x,3)+", "+myRound(mousePosWorld.y,3);
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

function animate() {
    if ( run )
        requestAnimFrame( animate );
    step();
}

function pause() {
    run = !run;
    if (run)
        animate();
    updateStats();
}

//console.log(A.a);
//console.log(Box2D.Dynamics);
//console.log(Box2D.Dynamics.b2BodyDef);

var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
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
      b2Body = Box2D.Dynamics.b2Body,
      b2_staticBody = Box2D.Dynamics.b2Body.b2_staticBody,
      b2_kinematicBody = Box2D.Dynamics.b2Body.b2_kinematicBody,
      b2_dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody,
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
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
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
      IBroadPhase = Box2D.Collision.IBroadPhase,
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
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef;

window['onload'] = function doOnload() {   
    /*
    using(Box2D.Common, "b2.+");
    using(Box2D.Common.Math, "b2.+");
    using(Box2D.Collision, "b2.+");
    using(Box2D.Collision.Shapes, "b2.+");
    using(Box2D.Dynamics, "b2.+");
    using(Box2D.Dynamics.Joints, "b2.+");
    using(Box2D.Dynamics.b2Body, "b2.+");//b2_dynamicBody etc
    */
    init();
    changeTest();
    animate();
}

//these need to be kept global for closure advanced optimization
window['currentTest'] = null;
//window['Box2D'] = Box2D;

/*
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function ttt(ns, recurse) {
    if ( typeof recurse === 'undefined' ) recurse = true;
    var parts = ns.split(".");
    var base = "window";
    for (i=0;i<parts.length;i++)
        base += "['"+parts[i]+"']";
    //if ( ns.endsWith('prototype') )
    //    recurse = false;
    for (var name in eval(ns)) {        
        console.log(base+"['"+name+"'] = "+ns+"."+name+";");
        //if ( typeof eval(ns+"."+name) == 'function' ) {
            if ( recurse )
                ttt(ns+"."+name+".prototype", true);
        //}
    }
}

//ttt('Box2D.Collision');
//ttt('Box2D.Collision.Shapes');
//ttt('Box2D.Common');
//ttt('Box2D.Common.Math');
//ttt('Box2D.Dynamics');
//ttt('Box2D.Dynamics.Contacts');
//ttt('Box2D.Dynamics.Joints');
*/