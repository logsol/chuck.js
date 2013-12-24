define([
	"Game/Core/Physics/Doll",
    "Game/Config/Settings",
    "Game/Core/NotificationCenter"
],
 
function (Parent, Settings, NotificationCenter) {
 
    function Doll(physicsEngine, playerId) {        
        this.animationDef = {
            "stand": [1,1],
            "walk": [2,28],
            "walkback": [29,55],
            //"jump": [56,80],
            "jump": [81,91],
            "fall": [81,91],
            "duck": [92,97],
            "standup": [98,103],
            "run": [104,126]
        }

        this.animatedMeshes = {};

        Parent.call(this, physicsEngine, playerId);
    }

    Doll.prototype = Object.create(Parent.prototype);

    Doll.prototype.setActionState = function(state) {

        if(this.actionState == state) return;

        if(this.animatedMeshes[this.actionState]) {
            NotificationCenter.trigger("view/updateMesh", this.animatedMeshes[this.actionState], { visible: false });
        }

        Parent.prototype.setActionState.call(this, state);

        NotificationCenter.trigger("view/updateMesh", this.animatedMeshes[this.actionState], { visible: true });
    }

    Doll.prototype.createMesh = function() {

        var padF = function(n) {
            if(n<10) return "00" + n;
            if(n<100) return "0" + n;
            return n;
        }

        var self = this;

        for (var key in this.animationDef) {
            var start = this.animationDef[key][0];
            var end = this.animationDef[key][1];

            var texturePaths = [];
            for (var i = start; i <= end; i++) {
                texturePaths.push(Settings.GRAPHICS_PATH + "Animation/WithArms/ChuckAnimations0" + padF(i) + ".png");
            }

            var callback = function(mesh) {
                self.animatedMeshes[key] = mesh;
                NotificationCenter.trigger("view/addMesh", mesh);
            };

            NotificationCenter.trigger("view/createAnimatedMesh", texturePaths, callback, { visible: false, pivot: "mb" });
        }
    }

    Doll.prototype.render = function() {
        if(this.actionState) {
            NotificationCenter.trigger("view/updateMesh",
                this.animatedMeshes[this.actionState],
                {
                    x: this.body.GetPosition().x * Settings.RATIO,
                    y: this.body.GetPosition().y * Settings.RATIO
                }
            );

        }
    }

    Doll.prototype.lookAt = function(x, y) {
        var oldLookDirection = this.lookDirection;
        Parent.prototype.lookAt.call(this, x, y);

        if(oldLookDirection != this.lookDirection) {
            for(var key in this.animatedMeshes) {
                NotificationCenter.trigger("view/updateMesh",
                    this.animatedMeshes[key],
                    {
                        xScale: this.lookDirection
                    }
                );                   
            }
        }
    };

    // TODO: implement destroy
 
    return Doll;
 
});