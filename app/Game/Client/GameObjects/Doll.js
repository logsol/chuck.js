define([
	"Game/Core/GameObjects/Doll",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception"
],
 
function (Parent, Settings, NotificationCenter, Exception) {
 
    function Doll(physicsEngine, uid, player) {      
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
        this.headMesh = null;

        Parent.call(this, physicsEngine, uid, player);
    }

    Doll.prototype = Object.create(Parent.prototype);

    Doll.prototype.setActionState = function(state) {

        if(this.actionState == state) return;

        if(!state) throw new Exception("action state is undefined");

        if(this.animatedMeshes[this.actionState]) {
            NotificationCenter.trigger("view/updateMesh", this.animatedMeshes[this.actionState], { visible: false });
        }

        Parent.prototype.setActionState.call(this, state);

        NotificationCenter.trigger("view/updateMesh", this.animatedMeshes[this.actionState], { visible: true });
    }

    Doll.prototype.createMesh = function() {

        // Body

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

            NotificationCenter.trigger("view/createAnimatedMesh", texturePaths, callback, { 
                visible: false, 
                pivot: "mb",
                width: 35,
                height: 40
            });
        }

        // Head

        var texturePath = Settings.GRAPHICS_PATH + "Characters/Chuck/head.png";
        var callback = function (mesh) {
            self.headMesh = mesh;
            NotificationCenter.trigger("view/addMesh", mesh);
        }
        NotificationCenter.trigger("view/createMesh", texturePath, callback, {
            pivot: "mb",
            width: 10,
            height: 12
        });

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

        var angle = Math.atan2(this.lookAtXY.x, this.lookAtXY.y) / 2 - 0.7855 * this.lookDirection; // 0.7855 = 45°

        NotificationCenter.trigger("view/updateMesh",
            this.headMesh,
            {
                xScale: this.lookDirection,
                rotation: angle
            }
        );
    }


    Doll.prototype.destroy = function () {
        for (var key in this.animatedMeshes) {
            NotificationCenter.trigger("view/removeMesh", this.animatedMeshes[key]);
        }

        NotificationCenter.trigger("view/removeMesh", this.headMesh);

        Parent.prototype.destroy.call(this);
    }

    Doll.prototype.render = function() {
        if(this.actionState) {
            NotificationCenter.trigger("view/updateMesh",
                this.animatedMeshes[this.actionState],
                {
                    x: this.body.GetPosition().x * Settings.RATIO,
                    y: this.body.GetPosition().y * Settings.RATIO,
                    rotation: this.body.GetAngle()
                }
            );

            NotificationCenter.trigger("view/updateMesh",
                this.headMesh,
                {
                    x: this.body.GetPosition().x * Settings.RATIO,
                    y: this.body.GetPosition().y * Settings.RATIO - this.height + this.headHeight
                }
            )
        }
    }
 
    return Doll;
 
});