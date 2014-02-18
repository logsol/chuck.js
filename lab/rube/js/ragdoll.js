
var ragdoll = function() {
    //constructor
}

ragdoll.prototype.setNiceViewCenter = function() {
    //called once when the user changes to this test from another test
    PTM = 70;
    setViewCenterWorld( new b2Vec2(0, 1), true );
}

ragdoll.prototype.setup = function() {
    //set up the Box2D scene here - the world is already created
    
    var c = document.getElementById('canvas');

    var ctx = c.getContext("2d");
    if(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
    }
    setTimeout(function(){
    	document.getElementById('drawShapesCheck').checked = false;
    	updateWorldFromDebugDrawCheckboxes();
    }, 10);
    

    if ( loadSceneFromRUBE(ragdoll_scene) ) //jack_scene is defined in jack-min.js
        console.log("RUBE scene loaded successfully.");
    else
        console.log("Failed to load RUBE scene");
        
    doAfterLoading();
    
}

ragdoll.prototype.getComments = function(canvas, evt) {
    return "Created in R.U.B.E editor. Pull the latch to the side to open the box.";
}
