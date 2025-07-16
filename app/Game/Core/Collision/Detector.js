define([
    "Lib/Vendor/Planck"
],

function (Planck) {

	"use strict";

    function Detector () {
        // In Planck.js, contact listeners are handled via world events
        // We'll store the world reference when getListener is called
        this.world = null;
    }

    Detector.prototype.getListener = function () {
        // Instead of returning a listener object, we return a function
        // that will set up the event listeners on the world
        return this.setupWorldEvents.bind(this);
    }

    Detector.prototype.setupWorldEvents = function (world) {
        this.world = world;
        
        // Set up Planck.js event listeners
        world.on('begin-contact', this.beginContact.bind(this));
        world.on('end-contact', this.endContact.bind(this));
        
        return this;
    }

    Detector.prototype.onCollisionChange = function (contact, isColliding) {
        var userDataA = contact.getFixtureA().getUserData();
        var userDataB = contact.getFixtureB().getUserData();

        // Check if this is a foot sensor collision
        var isFootSensorCollision = false;
        var footSensorUserData = null;
        
        if (userDataA && userDataA.isFootSensor) {
            isFootSensorCollision = true;
            footSensorUserData = userDataA;
        }
        
        if (userDataB && userDataB.isFootSensor) {
            isFootSensorCollision = true;
            footSensorUserData = userDataB;
        }

        if (userDataA && userDataA.onCollisionChange) {
            userDataA.onCollisionChange(isColliding, contact.getFixtureB());
        } 

        if (userDataB && userDataB.onCollisionChange) {
            userDataB.onCollisionChange(isColliding, contact.getFixtureA());
        }
    }

    Detector.prototype.beginContact = function (contact) {
        this.onCollisionChange(contact, true);
    }

    Detector.prototype.endContact = function (contact) {
        this.onCollisionChange(contact, false);
    }

    return Detector;
});