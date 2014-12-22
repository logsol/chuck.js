define([
    "Lib/Vendor/Box2D"
],

function (Box2D) {

	"use strict";

    function Detector () {
        this.listener = new Box2D.Dynamics.b2ContactListener();
        this.listener.BeginContact = this.beginContact.bind(this);
        //this.listener.PostSolve = this.postSolve.bind(this);
        this.listener.EndContact = this.endContact.bind(this);
    }

    Detector.prototype.getListener = function () {
        return this.listener;
    }

    Detector.prototype.onCollisionChange = function (point, isColliding) {
        var userDataA = point.GetFixtureA().GetUserData();
        var userDataB = point.GetFixtureB().GetUserData();

        if (userDataA && userDataA.onCollisionChange) {
            userDataA.onCollisionChange(isColliding, point.GetFixtureB());
        } 

        if (userDataB && userDataB.onCollisionChange) {
            userDataB.onCollisionChange(isColliding, point.GetFixtureA());
        }
    }

    /** Extension **/

    Detector.prototype.beginContact = function (point) {
        this.onCollisionChange(point, true);
    }

/*
    Detector.prototype.postSolve = function (point, impulse) {
        var userDataA = point.GetFixtureA().GetUserData();
        var userDataB = point.GetFixtureB().GetUserData();

        if (userDataA && userDataA.onImpulse) {
            userDataA.onImpulse(impulse, point.GetFixtureB());
        } else if (userDataB && userDataB.onImpulse) {
            userDataB.onImpulse(impulse, point.GetFixtureA());
        }
    }
*/

    Detector.prototype.endContact = function (point) {
        this.onCollisionChange(point, false);
    }

    return Detector;
});