define([
	"Game/Core/Physics/Doll",
    "Game/Config/Settings",
    "Game/Core/NotificationCenter"
],
 
function (Parent, Settings, NotificationCenter) {
 
    function Doll(physicsEngine, playerId) {
    	Parent.call(this, physicsEngine, playerId);
        this.height = 36;
    }

    Doll.prototype = Object.create(Parent.prototype);
 
    Doll.prototype.createMesh = function() {
        var self = this;

        var imgPath = Settings.GRAPHICS_PATH
                    + Settings.GRAPHICS_SUBPATH_CHARACTERS
                    + 'Chuck' + '/'
                    + 'chuck.png';

        var callback = function(mesh) {
            self.mesh = mesh;
            NotificationCenter.trigger("view/addMesh", mesh);
        }
   
        NotificationCenter.trigger("view/createMesh",
            10, 
            36, 
            0, 
            0, 
            imgPath, 
            callback
        );
    };

    Doll.prototype.render = function() {

        NotificationCenter.trigger("view/updateMesh",
            this.mesh,
            {
                x: this.body.GetPosition().x * Settings.RATIO + 4,
                y:  (this.body.GetPosition().y * Settings.RATIO) - 29
            }
        );
    }
 
    return Doll;
 
});