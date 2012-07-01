define(['Doll'], function(){

	function Player (physicsEngine, repository) {
	    this._physicsEngine = physicsEngine;
	    this._repository = repository;
	    this._standing = false;
	    this._doll;
	    this._mc;
	    this._currentAnimationState = 'stand';
	    this._lookDirection = 1;
	    this._moveDirection = 0;
	    
	    this.init();
	}

	Player.prototype.init = function() {
	    this._doll = new Doll(this._physicsEngine);
	//this._mc = EmbedHandler.load(EmbedHandler.CHUCK);
	//this._mc.stop();
	//var mclp = new MovieClipLabelParser();
	//mclp.parse(this._mc);
	}

	Player.prototype.spawn = function(x, y) {
	    //this._repository.createModel(this._mc, this._doll.getBody());
	    this._doll.spawn(x, y);
	}

	Player.prototype.getDoll = function() {
	    return this._doll;
	}

	Player.prototype.getBody = function() {
	    return this._doll.getBody();
	}

	Player.prototype.setStanding = function(isStanding) {
	    var resetStates = ['jump', 'jumploop'];
	    if (resetStates.indexOf(this._currentAnimationState)>=0 && !this._standing && isStanding)
	    {
	        this._animate('stand');
	    }
	    this._standing = isStanding;
	}

	Player.prototype.isStanding = function() {
	    return this._standing;
	}

	Player.prototype.move = function(direction) {
	    this._moveDirection = direction;
	    
	    switch(true) {
	        case direction == this._lookDirection && this.isStanding():
	            this._doll.move(direction, Chuck.Settings.RUN_SPEED);
	            break;

	        case !this.isStanding():
	            this._doll.move(direction, Chuck.Settings.FLY_SPEED);
	            break;

	        default:
	            this._doll.move(direction, Chuck.Settings.WALK_SPEED);
	            break;
	    }

	    if (this.isStanding()) {
	        this._animate(this._calculateWalkAnimation());
	    }
	}

	Player.prototype.stop = function() {
	    this._moveDirection = 0;
	    this._doll.stop();
	    if (this._isWalking() || this._standing) {
	        this._animate('stand');
	    }
	}

	Player.prototype.jump = function() {
	    if (this.isStanding())
	    {
	        this._doll.jump();
	        this._animate('jump');
	        this.setStanding(false);
	    }
	}

	Player.prototype.jumping = function() {
	    if (!this.isStanding()) {
	        this._doll.jumping();
	    }
	}

	Player.prototype.duck = function() {
	    if (this._standing && !this._isWalking()) {
	        this._animate('duck');
	    }
	}

	Player.prototype.standUp = function() {
	    if (this._standing) {
	        this._animate('standup');
	    }
	}

	Player.prototype._animate = function(type) {
	    if (type == this._currentAnimationState) {
	        return;
	    }

	    //this._mc.gotoAndPlay(type);

	    this._currentAnimationState = type;
	}

	Player.prototype._calculateWalkAnimation = function() {
	    if (this._moveDirection == this._lookDirection) {
	        return 'run';
	    } 
	    return 'walkback';
	}

	Player.prototype.look = function(x, y) {
		/*
	    var degree = Math.atan2(Chuck.Settings.STAGE_WIDTH / 2 - x, Chuck.Settings.STAGE_HEIGHT / 2 - 25 - y) / (Math.PI / 180);
	    var lastLookDirection = this._lookDirection;

	    if (x < Chuck.Settings.STAGE_WIDTH / 2) {
	        this._mc.scaleX = -1;
	        this._lookDirection = -1;
	        degree = (-45 + degree / 2);
	        this._mc.head.rotation = degree;
	    } else if (x >= Chuck.Settings.STAGE_WIDTH / 2) {
	        this._mc.scaleX = 1;
	        this._lookDirection = 1;
	        degree = (45 + -degree / 2) - 90;
	        this._mc.head.rotation = degree;
	    }

	    if (this._lookDirection != lastLookDirection && this._isWalking()) {
	        this._animate(this._calculateWalkAnimation());
	    }*/
	}

	Player.prototype._isWalking = function() {
	    var states = ['walk', 'walkback', 'run'];

	    if (states.indexOf(this._currentAnimationState) >= 0) {
	        return true;
	    }
	    return false;
	}

	// called by CollisionDetection
	Player.prototype.onFootSensorDetection = function(isColliding) {
	    if(isColliding) {
	        if(this._doll.getBody().GetLinearVelocity().y < -Chuck.Settings.JUMP_SPEED && !this.isStanding()) {
	            return;
	        }
	        this.setStanding(true);
	    } else {
	    // TODO This needs some more thought to it.
	    // maybe take a look at collision groups for collision detection, 
	    // to group all tiles together

	    //this.setStanding(false);
	    //this._animate('jumploop');
	    }
	}

	Player.prototype.update = function() {
	    //this._mc.head.y = this._mc.head_posmask.y;

	    if (this._doll.getBody().GetLinearVelocity().x == 0 && this._isWalking()) {
	        this.stop();
	    }

	    if (!this._doll.getBody().IsAwake()) {
	        this.setStanding(true);
	    }
	}
}
