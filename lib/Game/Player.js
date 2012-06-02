var Player = function() {
    this._standing;
    this._doll;
    this._mc;
    this._currentAnimationState = 'stand';
    this._lookDirection = 1;
    this._moveDirection = 0;
}

function Player() {
    this._doll = new Doll();
    this._mc = EmbedHandler.load(EmbedHandler.CHUCK);
    this._mc.stop();
    var mclp = new MovieClipLabelParser();
    mclp.parse(this._mc);
}

function spawn(x, y) {
    Repository.getInstance().createModel(this._mc, this._doll.getBody());
    this._doll.spawn(x, y);
}

function getDoll() {
    return this._doll;
}

function getBody() {
    return this._doll.getBody();
}

function setStanding(isStanding) {
    var resetStates = ['jump', 'jumploop'];
    if (resetStates.indexOf(this._currentAnimationState)>=0 && !this._standing && isStanding)
    {
        this._animate('stand');
    }
    this._standing = isStanding;
}

function isStanding() {
    return this._standing;
}

function move(direction) {
    this._moveDirection = direction;

    switch(true) {
        case direction == this._lookDirection && this.isStanding()
            this._doll.move(direction, Settings.RUN_SPEED);
            break;

        case !this.isStanding()
            this._doll.move(direction, Settings.FLY_SPEED);
            break;

        default
            this._doll.move(direction, Settings.WALK_SPEED);
            break;
    }

    if (this.isStanding()) {
        this._animate(this._calculateWalkAnimation());
    }
}

function stop() {
    this._moveDirection = 0;
    this._doll.stop();
    if (this._isWalking() || this._standing) {
        this._animate('stand');
    }
}

function jump() {
    if (this.isStanding())
    {
        this._doll.jump();
        this._animate('jump');
        this.setStanding(false);
    }
}

function jumping() {
    if (!this.isStanding()) {
        this._doll.jumping();
    }
}

function duck() {
    if (this._standing && !this._isWalking())
    {
        this._animate('duck');
    }
}

function standUp() {
    if (this._standing)
    {
        this._animate('standup');
    }
}

function _animate(type) {
    if (type == this._currentAnimationState)
    {
        return;
    }

    this._mc.gotoAndPlay(type);

    this._currentAnimationState = type;
}

function _calculateWalkAnimation() {
    if (this._moveDirection == this._lookDirection)
    {
        return 'run';
    } 
    return 'walkback';
}

function look(x, y) {
    var degree = Math.atan2(Settings.STAGE_WIDTH / 2 - x, Settings.STAGE_HEIGHT / 2 - 25 - y) / (Math.PI / 180);
    var lastLookDirection = this._lookDirection;

    if (x < Settings.STAGE_WIDTH / 2) {
        this._mc.scaleX = -1;
        this._lookDirection = -1;
        degree = (-45 + degree / 2);
        this._mc.head.rotation = degree;
    } else if (x >= Settings.STAGE_WIDTH / 2) {
        this._mc.scaleX = 1;
        this._lookDirection = 1;
        degree = (45 + -degree / 2) - 90;
        this._mc.head.rotation = degree;
    }

    if (this._lookDirection != lastLookDirection && this._isWalking()) {
        this._animate(this._calculateWalkAnimation());
    }
}

function _isWalking() {
    var states = ['walk', 'walkback', 'run'];

    if (states.indexOf(this._currentAnimationState) >= 0) {
        return true;
    }
    return false;
}

// called by CollisionDetection
function onFootSensorDetection(isColliding) {
    if(isColliding) {
        if(this._doll.getBody().GetLinearVelocity().y < -Settings.JUMP_SPEED && !this.isStanding()) {
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

function update() {
    this._mc.head.y = this._mc.head_posmask.y;

    if (this._doll.getBody().GetLinearVelocity().x == 0 && this._isWalking()) {
        this.stop();
    }

    if (!this._doll.getBody().IsAwake()) {
        this.setStanding(true);
    }
}
