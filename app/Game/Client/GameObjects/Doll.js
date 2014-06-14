define([
	"Game/Core/GameObjects/Doll",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception"
],
 
function (Parent, Settings, Nc, Exception) {
 
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

        this.animatedMeshesContainer = {
            withArms: {},
            withoutArms: {}
        };
        this.animatedMeshes = this.animatedMeshesContainer.withArms;
        this.headMesh = null;
        this.holdingArmMesh = null;

        Parent.call(this, physicsEngine, uid, player);
    }

    Doll.prototype = Object.create(Parent.prototype);

    Doll.prototype.setActionState = function(state, force) {

        if(!force && this.actionState == state) return;
        console.log(state)

        if(!state) throw new Exception("action state is undefined");

        if(this.animatedMeshes[this.actionState]) {
            Nc.trigger(
                Nc.ns.client.view.mesh.update,
                this.animatedMeshesContainer.withArms[this.actionState],
                { visible: false }
            );
            Nc.trigger(
                Nc.ns.client.view.mesh.update,
                this.animatedMeshesContainer.withoutArms[this.actionState],
                { visible: false }
            );
        }

        Parent.prototype.setActionState.call(this, state);

        Nc.trigger(
            Nc.ns.client.view.mesh.update,
            this.animatedMeshes[this.actionState],
            {
                visible: true,
                xScale: this.lookDirection
            }
        );
    }

    Doll.prototype.createMesh = function() {

        // Body

        var padF = function(n) {
            if(n<10) return "00" + n;
            if(n<100) return "0" + n;
            return n;
        }

        var self = this;

        var arms = ["withArms", "withoutArms"];
        for (var j = 0; j < arms.length; j++) {
            var arm = arms[j];
            for (var key in this.animationDef) {
                var start = this.animationDef[key][0];
                var end = this.animationDef[key][1];

                var texturePaths = [];
                for (var i = start; i <= end; i++) {
                    texturePaths.push(
                          Settings.GRAPHICS_PATH 
                        + Settings.GRAPHICS_SUBPATH_CHARACTERS 
                        + this.characterName 
                        + "/Animation/" + arm.toUpperCaseFirstChar() + "/ChuckAnimations0" 
                        + padF(i) 
                        + ".png"
                    );
                }

                var callback = function(mesh) {
                    self.animatedMeshesContainer[arm][key] = mesh;
                    Nc.trigger(Nc.ns.client.view.mesh.add, mesh);
                };

                Nc.trigger(Nc.ns.client.view.animatedMesh.create, texturePaths, callback, { 
                    visible: false, 
                    pivot: {
                        x: 35/2 * 4,
                        y: 40 * 4
                    },
                    width: 35,
                    height: 40
                });
            }

        };

        // Head

        var texturePath = Settings.GRAPHICS_PATH + "Characters/Chuck/head.png";
        var callback = function (mesh) {
            self.headMesh = mesh;
            Nc.trigger(Nc.ns.client.view.mesh.add, mesh);
        }
        Nc.trigger(Nc.ns.client.view.mesh.create, texturePath, callback, {
            pivot: {
                x: 5,
                y: 12
            },
            width: 10,
            height: 12
        });

        texturePath = Settings.GRAPHICS_PATH + "Characters/Chuck/holdingArm.png";
        var callback = function (mesh) {
            self.holdingArmMesh = mesh;
            Nc.trigger(Nc.ns.client.view.mesh.add, mesh);
        }
        Nc.trigger(Nc.ns.client.view.mesh.create, texturePath, callback, {
            visible: false,
            pivot: {
                x: 35/2 * 4,
                y: 40 * 4
            },
            width: 35,
            height: 40
        });

    }

    Doll.prototype.lookAt = function(x, y) {
        var oldLookDirection = this.lookDirection;

        Parent.prototype.lookAt.call(this, x, y);

        if(oldLookDirection != this.lookDirection) {
            for(var key in this.animatedMeshes) {
                Nc.trigger(Nc.ns.client.view.mesh.update,
                    this.animatedMeshes[key],
                    {
                        xScale: this.lookDirection
                    }
                );                   
            }

            Nc.trigger(Nc.ns.client.view.mesh.update,
                this.holdingArmMesh,
                {
                    xScale: this.lookDirection
                }
            );
        }

        var angle = Math.atan2(this.lookAtXY.x, this.lookAtXY.y) / 2 - 0.7855 * this.lookDirection; // 0.7855 = 45°

        Nc.trigger(Nc.ns.client.view.mesh.update,
            this.headMesh,
            {
                xScale: this.lookDirection,
                rotation: angle
            }
        );
    }

    Doll.prototype.grab = function(item) {
        Parent.prototype.grab.call(this, item);
        this.animatedMeshes = this.animatedMeshesContainer.withoutArms;
        this.setActionState(this.actionState, true);
        Nc.trigger(Nc.ns.client.view.mesh.update, this.holdingArmMesh, { visible: true });
    };

    Doll.prototype.throw = function(item, x, y) {
        Parent.prototype.throw.call(this, item, x, y);
        this.animatedMeshes = this.animatedMeshesContainer.withArms;
        this.setActionState(this.actionState, true);
        Nc.trigger(Nc.ns.client.view.mesh.update, this.holdingArmMesh, { visible: false });
    };

    Doll.prototype.destroy = function () {
        for (var key in this.animatedMeshes) {
            Nc.trigger(Nc.ns.client.view.mesh.remove, this.animatedMeshes[key]);
        }

        Nc.trigger(Nc.ns.client.view.mesh.remove, this.headMesh);

        Parent.prototype.destroy.call(this);
    }

    Doll.prototype.render = function() {
        if(this.actionState) {
            Nc.trigger(Nc.ns.client.view.mesh.update,
                this.animatedMeshes[this.actionState],
                {
                    x: this.body.GetPosition().x * Settings.RATIO,
                    y: this.body.GetPosition().y * Settings.RATIO,
                    //rotation: this.body.GetAngle()
                }
            );

            Nc.trigger(Nc.ns.client.view.mesh.update,
                this.headMesh,
                {
                    x: this.body.GetPosition().x * Settings.RATIO,
                    y: this.body.GetPosition().y * Settings.RATIO - this.height + this.headHeight
                }
            )

            Nc.trigger(Nc.ns.client.view.mesh.update,
                this.holdingArmMesh,
                {
                    x: this.body.GetPosition().x * Settings.RATIO,
                    y: this.body.GetPosition().y * Settings.RATIO
                }
            )
        }
    }
 
    return Doll;
 
});