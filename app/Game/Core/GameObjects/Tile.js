define([
	"Game/" + GLOBALS.context + "/GameObjects/GameObject",
	"Lib/Vendor/Planck",
	"Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert"
],
 
function (Parent, planck, Settings, Exception, nc, Assert) {

	"use strict";
 
    function Tile(physicsEngine, uid, options) {
    	this.options = options;
    	Parent.call(this, physicsEngine, uid);
    	this.createPhysicTile(this.options);
    }

    Tile.prototype = Object.create(Parent.prototype);
 
    Tile.prototype.getBodyDef = function() {
        Assert.number(this.options.x, this.options.y);
        Assert.number(this.options.r);

    	var bodyDef = {
            type: 'static',
            position: planck.Vec2(
                (this.options.x * Settings.TILE_SIZE + Settings.TILE_SIZE / 2) / Settings.RATIO,
                (this.options.y * Settings.TILE_SIZE + Settings.TILE_SIZE / 2) / Settings.RATIO
            ),
            angle: (this.options.r || 0) * 90 * Math.PI / 180
        };

        return bodyDef;
    };

    Tile.prototype.createPhysicTile = function (tile) {
        var vertices = this.createVertices(tile);
        var tileShape = planck.Polygon(vertices);

        var fixtureDef = {
            shape: tileShape,
            density: 0,
            friction: Settings.TILE_FRICTION,
            restitution: Settings.TILE_RESTITUTION,
            isSensor: false
        };
        this.body.createFixture(fixtureDef);
    };

    Tile.prototype.createVertices = function (tile) {
        var vs = [];

        switch(tile.s) {
            case 1:
                this.addVec(vs, -1, -1); // o o o
                this.addVec(vs,  1, -1); // o o o
                this.addVec(vs,  1,  1); // o o o
                this.addVec(vs, -1,  1); 
                break;

            case 2:
                this.addVec(vs, -1, -1); // o
                this.addVec(vs,  1,  1); // o o
                this.addVec(vs, -1,  1); // o o o
                break;

            case 3:
                this.addVec(vs, -1, -1); // o
                this.addVec(vs,  0,  1); // o
                this.addVec(vs, -1,  1); // o o
                break;

            case 4:
                this.addVec(vs, -1, -1); // o
                this.addVec(vs,  1,  0); // o o o
                this.addVec(vs,  1,  1); // o o o
                this.addVec(vs, -1,  1);
                break;

            case 5:
                this.addVec(vs,  1, -1); // o
                this.addVec(vs,  1,  1); // o
                this.addVec(vs,  0,  1); // o o
                break;

            case 6:
                this.addVec(vs,  1, -1); //     o
                this.addVec(vs,  1,  1); // o o o
                this.addVec(vs, -1,  1); // o o o
                this.addVec(vs, -1,  0);
                break;

            case 7:
                this.addVec(vs, -1, 0); //
                this.addVec(vs,  0, 1); // o
                this.addVec(vs, -1, 1); // o o
                break;

            case 8:
                this.addVec(vs, -1, -1); // o o
                this.addVec(vs,  0, -1); // o o o
                this.addVec(vs,  1,  0); // o o o
                this.addVec(vs,  1,  1); 
                this.addVec(vs, -1,  1);
                break;

            default:
                throw new Exception("Tile Creation - no shape given");
        }

        return vs;
    };

    Tile.prototype.mkArg = function (multiplier) {
        return Settings.TILE_SIZE / 2 / Settings.RATIO * multiplier;
    };

    Tile.prototype.addVec = function (vs, m1, m2) {
        return vs.push(planck.Vec2(this.mkArg(m1), this.mkArg(m2)));
    };
 
    return Tile;
 
});