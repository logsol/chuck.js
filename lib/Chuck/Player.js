define(["Chuck/Physics/Doll", "Chuck/Settings"], function(Doll, Settings){

	function Player (physicsEngine, id, repository) {
	    this.physicsEngine = physicsEngine;
	    this.id = id;
	    this.repository = repository;
	    this.standing = false;
	    this.doll;
	    this.mc;
	    this.currentAnimationState = 'stand';
	    this.lookDirection = 1;
	    this.moveDirection = 0;
	    
	    this.init(id);
	}

	Player.prototype.init = function(id) {
	    this.doll = new Doll(this.physicsEngine, id);
	//this.mc = EmbedHandler.load(EmbedHandler.CHUCK);
	//this.mc.stop();
	//var mclp = new MovieClipLabelParser();
	//mclp.parse(this.mc);
	}

	Player.prototype.spawn = function(x, y) {
	    //this.repository.createModel(this.mc, this.doll.getBody());
	    this.doll.spawn(x, y);
	}

	Player.prototype.getDoll = function() {
	    return this.doll;
	}

	Player.prototype.getBody = function() {
	    return this.doll.getBody();
	}

	Player.prototype.setStanding = function(isStanding) {
	    var resetStates = ['jump', 'jumploop'];
	    if (resetStates.indexOf(this.currentAnimationState)>=0 && !this.standing && isStanding) {
	        this.animate('stand');
	    }
	    this.standing = isStanding;
	}

	Player.prototype.isStanding = function() {
	    return this.standing;
	}

	Player.prototype.move = function(direction) {
	    this.moveDirection = direction;
	    
	    switch(true) {
	        case direction == this.lookDirection && this.isStanding():
	            this.doll.move(direction, Settings.RUN_SPEED);
	            break;

	        case !this.isStanding():
	            this.doll.move(direction, Settings.FLY_SPEED);
	            break;

	        default:
	            this.doll.move(direction, Settings.WALK_SPEED);
	            break;
	    }

	    if (this.isStanding()) {
	        this.animate(this.calculateWalkAnimation());
	    }
	}

	Player.prototype.stop = function() {
	    this.moveDirection = 0;
	    this.doll.stop();
	    if (this.isWalking() || this.standing) {
	        this.animate('stand');
	    }
	}

	Player.prototype.jump = function() {
	    if (this.isStanding()) {
	        this.doll.jump();
	        this.animate('jump');
	        this.setStanding(false);
	    }
	}

	Player.prototype.jumping = function() {
	    if (!this.isStanding()) {
	        this.doll.jumping();
	    }
	}

	Player.prototype.duck = function() {
	    if (this.standing && !this.isWalking()) {
	        this.animate('duck');
	    }
	}

	Player.prototype.standUp = function() {
	    if (this.standing) {
	        this.animate('standup');
	    }
	}

	Player.prototype.animate = function(type) {
	    if (type == this.currentAnimationState) {
	        return;
	    }

	    //this.mc.gotoAndPlay(type);

	    this.currentAnimationState = type;
	}

	Player.prototype.calculateWalkAnimation = function() {
	    if (this.moveDirection == this.lookDirection) {
	        return 'run';
	    } 
	    return 'walkback';
	}

	Player.prototype.look = function(x, y) {
		/*
	    var degree = Math.atan2(Settings.STAGE_WIDTH / 2 - x, Settings.STAGE_HEIGHT / 2 - 25 - y) / (Math.PI / 180);
	    var lastLookDirection = this.lookDirection;

	    if (x < Settings.STAGE_WIDTH / 2) {
	        this.mc.scaleX = -1;
	        this.lookDirection = -1;
	        degree = (-45 + degree / 2);
	        this.mc.head.rotation = degree;
	    } else if (x >= Settings.STAGE_WIDTH / 2) {
	        this.mc.scaleX = 1;
	        this.lookDirection = 1;
	        degree = (45 + -degree / 2) - 90;
	        this.mc.head.rotation = degree;
	    }

	    if (this.lookDirection != lastLookDirection && this.isWalking()) {
	        this.animate(this.calculateWalkAnimation());
	    }*/
	}

	Player.prototype.isWalking = function() {
	    var states = ['walk', 'walkback', 'run'];

	    if (states.indexOf(this.currentAnimationState) >= 0) {
	        return true;
	    }
	    return false;
	}

	// called by CollisionDetection
	Player.prototype.onFootSensorDetection = function(isColliding) {
	    if(isColliding) {
	        if(this.doll.getBody().GetLinearVelocity().y < -Settings.JUMP_SPEED && !this.isStanding()) {
	            return;
	        }
	        this.setStanding(true);
	    } else {
	    // TODO This needs some more thought to it.
	    // maybe take a look at collision groups for collision detection, 
	    // to group all tiles together

	    //this.setStanding(false);
	    //this.animate('jumploop');
	    }
	}

	Player.prototype.update = function() {
	    //this.mc.head.y = this.mc.head_posmask.y;

	    if (this.doll.getBody().GetLinearVelocity().x == 0 && this.isWalking()) {
	        this.stop();
	    }

	    if (!this.doll.getBody().IsAwake()) {
	        this.setStanding(true);
	    }
	}

	return Player;
});
