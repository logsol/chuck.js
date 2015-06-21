define([
	"Game/Core/GameObjects/Items/RubeDoll",
    "Game/Client/View/Abstract/Layer",
    "Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
],
 
function (Parent, Layer, Settings, Nc) {

	"use strict";
 
    function RubeDoll(physicsEngine, uid, options) {

        this.primaryColor = options.primaryColor;

        var limbOptions = {};

        limbOptions.chest = {
            width: 6,
            height: 18,
            x: 0,
            y: 0
        };

        limbOptions.head = {
            width: 10,
            height: 12,
            x: 0,
            y: - limbOptions.chest.height / 2 - 7
        };

        limbOptions.upperLeftLeg = {
            width: 5,
            height: 8,
            x: -2,
            y: limbOptions.chest.height / 2
        };

        limbOptions.upperRightLeg = {
            width: 5,
            height: 8,
            x: 2,
            y: limbOptions.chest.height / 2
        };

        limbOptions.lowerLeftLeg = {
            width: 5,
            height: 4,
            x: -2,
            y: limbOptions.chest.height / 2 + limbOptions.upperLeftLeg.height
        };

        limbOptions.lowerRightLeg = {
            width: 5,
            height: 4,
            x: 2,
            y: limbOptions.chest.height / 2 + limbOptions.upperRightLeg.height
        };



        limbOptions.upperLeftArm = {
            width: 4,
            height: 8,
            x: -2,
            y: -limbOptions.chest.height / 2
        };

        limbOptions.upperRightArm = {
            width: 4,
            height: 8,
            x: 2,
            y: -limbOptions.chest.height / 2
        };

        limbOptions.lowerLeftArm = {
            width: 4,
            height: 5,
            x: -2,
            y: -limbOptions.chest.height / 2 + limbOptions.upperLeftArm.height
        };

        limbOptions.lowerRightArm = {
            width: 4,
            height: 5,
            x: 2,
            y: -limbOptions.chest.height / 2 + limbOptions.upperRightArm.height
        };

        this.limbOptions = limbOptions;

        this.layerId = Layer.ID.SPAWN;
        this.limbMeshes = {};
        this.baseMeshName = "chest";
        this.characterName = "Chuck";
        this.lastFlipDirection = -options.direction || 1;

        console.log(this.lastFlipDirection);

        Parent.call(this, physicsEngine, uid, options);
    }

    RubeDoll.prototype = Object.create(Parent.prototype);
 
    RubeDoll.prototype.createMesh = function() {

        this.createLimbMesh("lowerRightLeg");
        this.createLimbMesh("upperRightLeg");
        this.createLimbMesh("lowerRightArm");
        this.createLimbMesh("upperRightArm");

        this.createLimbMesh("chest");
        this.createLimbMesh("head");

        this.createLimbMesh("lowerLeftLeg");
        this.createLimbMesh("upperLeftLeg");
        this.createLimbMesh("lowerLeftArm");
        this.createLimbMesh("upperLeftArm");

    };

    RubeDoll.prototype.createLimbMesh = function(name) {
        var self = this;
        var texturePath = Settings.GRAPHICS_PATH 
            + Settings.GRAPHICS_SUBPATH_CHARACTERS + ""
            + this.characterName + '/';


        var callback = function(mesh) {
            if(name == self.baseMeshName) {
                self.mesh = mesh;
            } 
        
            self.limbMeshes[name] = mesh;
                
            Nc.trigger(Nc.ns.client.view.mesh.add, self.layerId, mesh);

            // setting shirt color
            Nc.trigger(Nc.ns.client.view.mesh.addFilter, self.layerId, mesh, "colorRangeReplace", {
                minColor: 0x3b4a31,
                maxColor: 0x6d855d,
                newColor: self.primaryColor,
                brightnessOffset: 0.56
            });
        };
   
        Nc.trigger(Nc.ns.client.view.mesh.create,
            this.layerId,
            texturePath + name + ".png", 
            callback,
            {
                width: this.limbOptions[name].width, 
                height: this.limbOptions[name].height,
                pivot: {
                    x: this.limbOptions[name].width / 2,
                    y: this.limbOptions[name].height / 2
                }
            }
        );
    };

    RubeDoll.prototype.destroy = function() {
        
        for (var name in this.limbMeshes) {
            Nc.trigger(Nc.ns.client.view.mesh.remove, this.layerId, this.limbMeshes[name]);
        };

        Parent.prototype.destroy.call(this);
    };

    RubeDoll.prototype.render = function() {
        if(this.limbs) {
            for(var name in this.limbMeshes) {
                if(this.limbs[name]) {
                    Nc.trigger(Nc.ns.client.view.mesh.update,
                        this.layerId,
                        this.limbMeshes[name],
                        {
                            x: this.limbs[name].GetPosition().x * Settings.RATIO,
                            y: this.limbs[name].GetPosition().y * Settings.RATIO,
                            rotation: this.limbs[name].GetAngle()
                        }
                    );
                }
            }
        }
    };

    RubeDoll.prototype.flip = function(direction) {
        Parent.prototype.flip.call(this, direction);

        // flipping depth of right body side arm/leg images with left
        if (this.lastFlipDirection != direction) { // FIXME : this is a bit broken.

            this.lastFlipDirection = direction;

            Nc.trigger(Nc.ns.client.view.mesh.swapMeshIndexes,
                this.layerId,
                this.limbMeshes["lowerRightLeg"], 
                this.limbMeshes["lowerLeftLeg"]
            );
            Nc.trigger(Nc.ns.client.view.mesh.swapMeshIndexes,
                this.layerId,
                this.limbMeshes["upperRightLeg"], 
                this.limbMeshes["upperLeftLeg"]
            );
            Nc.trigger(Nc.ns.client.view.mesh.swapMeshIndexes,
                this.layerId,
                this.limbMeshes["lowerRightArm"], 
                this.limbMeshes["lowerLeftArm"]
            );
            Nc.trigger(Nc.ns.client.view.mesh.swapMeshIndexes,
                this.layerId,
                this.limbMeshes["upperRightArm"], 
                this.limbMeshes["upperLeftArm"]
            );

            // swap short images
            Nc.trigger(Nc.ns.client.view.mesh.swapMeshes,
                this.layerId,
                this.limbMeshes["upperRightLeg"],
                this.limbMeshes["upperLeftLeg"]
            );
        }

        // x flipping has to happen after (see swapMeshes)
        if(this.limbs) {
            for(var name in this.limbMeshes) {
                if(this.limbs[name]) {
                    Nc.trigger(Nc.ns.client.view.mesh.update,
                        this.layerId,
                        this.limbMeshes[name],
                        {
                            xScale: direction,
                        }
                    );
                }
            }
        }
    };

    return RubeDoll;
});