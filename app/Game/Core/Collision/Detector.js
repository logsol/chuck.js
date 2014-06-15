define([
    "Lib/Vendor/Box2D",
    "Game/Config/Settings"
],

function (Box2D, Settings) {

    function Detector () {
        this.listener = new Box2D.Dynamics.b2ContactListener();
        this.listener.BeginContact = this.beginContact.bind(this);
        //this.listener.PostSolve = this.postSolve.bind(this);
        this.listener.EndContact = this.endContact.bind(this);
    }

    Detector.prototype.getListener = function () {
        var self = this;
        var listener = this.listener

        if(Settings.USE_ASM) {
            Box2D.customizeVTable(listener, [{
                original: Box2D.b2ContactListener.prototype.BeginContact,
                replacement: function(thisPtr, contactPtr) {
                    var contact = Box2D.wrapPointer(contactPtr, Box2D.Dynamics.Contacts.b2Contact);
                    self.beginContact(contact);
                }
            },
            {
                original: Box2D.b2ContactListener.prototype.EndContact,
                replacement: function(thisPtr, contactPtr) {
                    var contact = Box2D.wrapPointer(contactPtr, Box2D.Dynamics.Contacts.b2Contact);
                    self.endContact(contact);
                }
            }]);
        }

        return listener;
    }

    Detector.prototype.onCollisionChange = function (point, isColliding) {
        console.log(point.GetFixtureA().GetUserData().onCollisionChange)
        var userDataA = point.GetFixtureA().GetUserData();
        var userDataB = point.GetFixtureB().GetUserData();

        //if (userDataA && userDataA.onCollisionChange) {
            try {
                userDataA.onCollisionChange(isColliding, point.GetFixtureB());
            } catch(e) {

            }
        //} 

        //if (userDataB && userDataB.onCollisionChange) {
            try{
                userDataB.onCollisionChange(isColliding, point.GetFixtureA());
            }catch(e) {

            }
        //}
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