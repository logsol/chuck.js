define([
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Vendor/RubeLoader",
    "Lib/Vendor/Box2D",
    "Game/Config/Settings"
],

function (Parent, RubeLoader, Box2D, Settings ) {

    // Fixme - make this loadable
    var __ragdollJson; 
 
    function Rube(physicsEngine, uid, options) {

        this.rubeLoader = null;
        this.body = null;

        Parent.call(this, physicsEngine, uid, options);
        var world = physicsEngine.getWorld();
        world.DestroyBody(this.body);   

        var json = __ragdollJson;

        this.rubeLoader = new RubeLoader(json, world);
        var scene = this.rubeLoader.getScene();

        for (var i in scene.bodies) {
            var body = scene.bodies[i];
            var position = body.GetPosition().Copy();
            position.Add(new Box2D.Common.Math.b2Vec2(
                options.x / Settings.RATIO, 
                options.y / Settings.RATIO
            ));
            body.SetPosition(position);

            if(body.name == "chest"){
                this.body = body;
            }
        }

        var def = this.body.GetDefinition();
        def.userData = this;
        this.body.SetUserData(this);
    }

    Rube.prototype = Object.create(Parent.prototype);

    Rube.prototype.flip = function(direction) {
        Parent.prototype.flip.call(this, direction);
        // Extend
    };

    __ragdollJson = 

{
    "allowSleep" : true,
    "autoClearForces" : true,
    "body" : 
    [
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.05748672783374786,
                                0.05748672783374786,
                                -0.05748683214187622,
                                -0.05748683214187622
                            ],
                            "y" : 
                            [
                                -0.2322469353675842,
                                0.2322462797164917,
                                0.2322462797164917,
                                -0.2322469353675842
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.001019014045596123,
            "massData-center" : 
            {
                "x" : -5.215406062575312e-08,
                "y" : -3.278255462646484e-07
            },
            "massData-mass" : 0.05340443924069405,
            "name" : "upperArmLeft",
            "position" : 
            {
                "x" : -0.1699507087469101,
                "y" : 1.113796472549438
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture0",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.1718577891588211,
                                0.1684816330671310,
                                0.001688212156295776,
                                -0.1718577295541763,
                                -0.1718577295541763,
                                0.001460619270801544
                            ],
                            "y" : 
                            [
                                -0.3928470611572266,
                                0.4921868443489075,
                                0.4921868443489075,
                                0.3841522336006165,
                                -0.4204435348510742,
                                -0.4519201517105103
                            ]
                        }
                    }
                },
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture2",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.1679489463567734,
                                0.1679489463567734,
                                -0.004204027354717255,
                                -0.004204027354717255
                            ],
                            "y" : 
                            [
                                0.4449140429496765,
                                0.6170670390129089,
                                0.6170670390129089,
                                0.4449140429496765
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.03228222951292992,
            "massData-center" : 
            {
                "x" : 0.008858840912580490,
                "y" : 0.06282533705234528
            },
            "massData-mass" : 0.3355117142200470,
            "name" : "chest",
            "position" : 
            {
                "x" : -0.05338868126273155,
                "y" : 0.9620395302772522
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "circle" : 
                    {
                        "center" : 
                        {
                            "x" : -0.007499951869249344,
                            "y" : 0.003749847412109375
                        },
                        "radius" : 0.2746430933475494
                    },
                    "density" : 0.2204959988594055,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture1"
                },
                
                {
                    "circle" : 
                    {
                        "center" : 
                        {
                            "x" : -0.03327952325344086,
                            "y" : -0.1384725570678711
                        },
                        "radius" : 0.2485582530498505
                    },
                    "density" : 0.2204959988594055,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture1"
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.004164268728345633,
            "massData-center" : 
            {
                "x" : -0.01910765282809734,
                "y" : -0.06028826907277107
            },
            "massData-mass" : 0.09504657238721848,
            "name" : "head",
            "position" : 
            {
                "x" : 0.04257059469819069,
                "y" : 1.812389135360718
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.05748683214187622,
                                0.05748683214187622,
                                -0.05748690664768219,
                                -0.05748690664768219
                            ],
                            "y" : 
                            [
                                -0.1419981122016907,
                                0.1419981718063354,
                                0.1419981718063354,
                                -0.1419981122016907
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.0002554289239924401,
            "massData-center" : 
            {
                "x" : -3.725290298461914e-08,
                "y" : 2.980232238769531e-08
            },
            "massData-mass" : 0.03265211358666420,
            "name" : "lowerArmRight",
            "position" : 
            {
                "x" : 0.1177217364311218,
                "y" : 0.8479318022727966
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.1415265351533890,
                                0.1415265351533890,
                                -0.08457186818122864,
                                -0.08457186818122864
                            ],
                            "y" : 
                            [
                                -0.1143886670470238,
                                -0.05680520832538605,
                                -0.05680520832538605,
                                -0.1143886670470238
                            ]
                        }
                    }
                },
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.08623030036687851,
                                0.08623030036687851,
                                -0.08623020350933075,
                                -0.08623020350933075
                            ],
                            "y" : 
                            [
                                -0.1138511821627617,
                                0.1565139442682266,
                                0.1565139442682266,
                                -0.1138511821627617
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.0005858240183442831,
            "massData-center" : 
            {
                "x" : 0.006215983536094427,
                "y" : -0.002008607611060143
            },
            "massData-mass" : 0.05964682996273041,
            "name" : "lowerLegLeft",
            "position" : 
            {
                "x" : -0.08319067955017090,
                "y" : 0.1298431605100632
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.05748684704303741,
                                0.05748684704303741,
                                -0.05748672783374786,
                                -0.05748672783374786
                            ],
                            "y" : 
                            [
                                -0.1419981122016907,
                                0.1419981718063354,
                                0.1419981718063354,
                                -0.1419981122016907
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.0002554284874349833,
            "massData-center" : 
            {
                "x" : 5.960464477539062e-08,
                "y" : 2.980232238769531e-08
            },
            "massData-mass" : 0.03265206888318062,
            "name" : "lowerArmLeft",
            "position" : 
            {
                "x" : -0.1699528992176056,
                "y" : 0.8479318022727966
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.05748683214187622,
                                0.05748683214187622,
                                -0.05748690664768219,
                                -0.05748690664768219
                            ],
                            "y" : 
                            [
                                -0.2322469353675842,
                                0.2322462797164917,
                                0.2322462797164917,
                                -0.2322469353675842
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.001019015791825950,
            "massData-center" : 
            {
                "x" : -3.725290298461914e-08,
                "y" : -3.278255462646484e-07
            },
            "massData-mass" : 0.05340452119708061,
            "name" : "upperArmRight",
            "position" : 
            {
                "x" : 0.1177217364311218,
                "y" : 1.113796472549438
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.08623021841049194,
                                0.08623021841049194,
                                -0.08623008430004120,
                                -0.08623008430004120
                            ],
                            "y" : 
                            [
                                -0.2315792292356491,
                                0.2315795421600342,
                                0.2315795421600342,
                                -0.2315792292356491
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.001625877106562257,
            "massData-center" : 
            {
                "x" : 6.705522537231445e-08,
                "y" : 1.564621925354004e-07
            },
            "massData-mass" : 0.07987650483846664,
            "name" : "upperLegRight",
            "position" : 
            {
                "x" : 0.03142313286662102,
                "y" : 0.4171121716499329
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.08623032271862030,
                                0.08623032271862030,
                                -0.08623017370700836,
                                -0.08623017370700836
                            ],
                            "y" : 
                            [
                                -0.2315792292356491,
                                0.2315795421600342,
                                0.2315795421600342,
                                -0.2315792292356491
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.001625879434868693,
            "massData-center" : 
            {
                "x" : 7.450580596923828e-08,
                "y" : 1.564621925354004e-07
            },
            "massData-mass" : 0.07987659424543381,
            "name" : "upperLegLeft",
            "position" : 
            {
                "x" : -0.08319067955017090,
                "y" : 0.4171121716499329
            },
            "type" : 2
        },
        
        {
            "angle" : 0,
            "angularVelocity" : 0,
            "awake" : true,
            "fixture" : 
            [
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.08623021841049194,
                                0.08623021841049194,
                                -0.08623008430004120,
                                -0.08623008430004120
                            ],
                            "y" : 
                            [
                                -0.1138515025377274,
                                0.1563164740800858,
                                0.1563164740800858,
                                -0.1138515025377274
                            ]
                        }
                    }
                },
                
                {
                    "density" : 1,
                    "filter-groupIndex" : -55,
                    "friction" : 0.2,
                    "name" : "fixture3",
                    "polygon" : 
                    {
                        "vertices" : 
                        {
                            "x" : 
                            [
                                0.1415264606475830,
                                0.1415264606475830,
                                -0.08457189798355103,
                                -0.08457189798355103
                            ],
                            "y" : 
                            [
                                -0.1143886670470238,
                                -0.05680520832538605,
                                -0.05680520832538605,
                                -0.1143886670470238
                            ]
                        }
                    }
                }
            ],
            "linearVelocity" : 0,
            "massData-I" : 0.0005849063745699823,
            "massData-center" : 
            {
                "x" : 0.006219535600394011,
                "y" : -0.002099231118336320
            },
            "massData-mass" : 0.05961277708411217,
            "name" : "lowerLegRight",
            "position" : 
            {
                "x" : 0.03142313286662102,
                "y" : 0.1298431605100632
            },
            "type" : 2
        }
    ],
    "collisionbitplanes" : 
    {
        "names" : 
        [
            "bitplane1",
            "bitplane2",
            "bitplane3",
            "bitplane4",
            "bitplane5",
            "bitplane6",
            "bitplane7",
            "bitplane8",
            "bitplane9",
            "bitplane10",
            "bitplane11",
            "bitplane12",
            "bitplane13",
            "bitplane14",
            "bitplane15",
            "bitplane16",
            "bitplane17",
            "bitplane18",
            "bitplane19",
            "bitplane20",
            "bitplane21",
            "bitplane22",
            "bitplane23",
            "bitplane24",
            "bitplane25",
            "bitplane26",
            "bitplane27",
            "bitplane28",
            "bitplane29",
            "bitplane30",
            "bitplane31",
            "bitplane32"
        ]
    },
    "continuousPhysics" : true,
    "gravity" : 
    {
        "x" : 0,
        "y" : -10
    },
    "image" : 
    [
        
        {
            "aspectScale" : 1,
            "body" : 9,
            "center" : 
            {
                "x" : 0.02911517955362797,
                "y" : -0.0009155124425888062
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.08536797016859055,
                    0.1435983330011368,
                    0.1435983330011368,
                    -0.08536797016859055
                ],
                "y" : 
                [
                    -0.1153986603021622,
                    -0.1153986603021622,
                    0.1135676354169846,
                    0.1135676354169846
                ]
            },
            "file" : "../../img/Characters/Chuck/lowerLeftLeg.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.08536797016859055,
                -0.1153986603021622,
                0.1435983330011368,
                -0.1153986603021622,
                0.1435983330011368,
                0.1135676354169846,
                -0.08536797016859055,
                0.1135676354169846
            ],
            "name" : "image5",
            "opacity" : 1,
            "scale" : 0.2289662957191467
        },
        
        {
            "aspectScale" : 1,
            "body" : 7,
            "center" : 
            {
                "x" : -0.02732392773032188,
                "y" : 0.02671334147453308
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.1425068378448486,
                    0.08785898983478546,
                    0.08785898983478546,
                    -0.1425068378448486
                ],
                "y" : 
                [
                    -0.2324482202529907,
                    -0.2324482202529907,
                    0.2858749032020569,
                    0.2858749032020569
                ]
            },
            "file" : "../../img/Characters/Chuck/upperRightLeg.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.1425068378448486,
                -0.2324482202529907,
                0.08785898983478546,
                -0.2324482202529907,
                0.08785898983478546,
                0.2858749032020569,
                -0.1425068378448486,
                0.2858749032020569
            ],
            "name" : "image6",
            "opacity" : 1,
            "scale" : 0.5183231234550476
        },
        
        {
            "aspectScale" : 1,
            "body" : 6,
            "center" : 
            {
                "x" : 0.0003027096390724182,
                "y" : 0.0006600618362426758
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.05836960300803185,
                    0.05897502228617668,
                    0.05897502228617668,
                    -0.05836960300803185
                ],
                "y" : 
                [
                    -0.2340291887521744,
                    -0.2340291887521744,
                    0.2353493124246597,
                    0.2353493124246597
                ]
            },
            "file" : "../../img/Characters/Chuck/upperLeftArm.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.05836960300803185,
                -0.2340291887521744,
                0.05897502228617668,
                -0.2340291887521744,
                0.05897502228617668,
                0.2353493124246597,
                -0.05836960300803185,
                0.2353493124246597
            ],
            "name" : "image4",
            "opacity" : 1,
            "renderOrder" : 1,
            "scale" : 0.4693785011768341
        },
        
        {
            "aspectScale" : 1,
            "body" : 3,
            "center" : 
            {
                "x" : 0.0007003694772720337,
                "y" : 0.001779437065124512
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.05596264451742172,
                    0.05736338347196579,
                    0.05736338347196579,
                    -0.05596264451742172
                ],
                "y" : 
                [
                    -0.1398780941963196,
                    -0.1398780941963196,
                    0.1434369683265686,
                    0.1434369683265686
                ]
            },
            "file" : "../../img/Characters/Chuck/lowerLeftArm.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.05596264451742172,
                -0.1398780941963196,
                0.05736338347196579,
                -0.1398780941963196,
                0.05736338347196579,
                0.1434369683265686,
                -0.05596264451742172,
                0.1434369683265686
            ],
            "name" : "image3",
            "opacity" : 1,
            "renderOrder" : 1,
            "scale" : 0.2833150625228882
        },
        
        {
            "aspectScale" : 1,
            "body" : 1,
            "center" : 
            {
                "x" : -0.0008481591939926147,
                "y" : -0.001265347003936768
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.1698881536722183,
                    0.1681918352842331,
                    0.1681918352842331,
                    -0.1698881536722183
                ],
                "y" : 
                [
                    -0.480212002992630,
                    -0.480212002992630,
                    0.4776813089847565,
                    0.4776813089847565
                ]
            },
            "file" : "../../img/Characters/Chuck/chest.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.1698881536722183,
                -0.480212002992630,
                0.1681918352842331,
                -0.480212002992630,
                0.1681918352842331,
                0.4776813089847565,
                -0.1698881536722183,
                0.4776813089847565
            ],
            "name" : "image2",
            "opacity" : 1,
            "renderOrder" : 5,
            "scale" : 0.9578933119773865
        },
        
        {
            "aspectScale" : 1,
            "body" : 8,
            "center" : 
            {
                "x" : 0.003173574805259705,
                "y" : -0.001172244548797607
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.1414211541414261,
                    0.1477683037519455,
                    0.1477683037519455,
                    -0.1414211541414261
                ],
                "y" : 
                [
                    -0.2325238138437271,
                    -0.2325238138437271,
                    0.2301793247461319,
                    0.2301793247461319
                ]
            },
            "file" : "../../img/Characters/Chuck/upperLeftLeg.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.1414211541414261,
                -0.2325238138437271,
                0.1477683037519455,
                -0.2325238138437271,
                0.1477683037519455,
                0.2301793247461319,
                -0.1414211541414261,
                0.2301793247461319
            ],
            "name" : "image6",
            "opacity" : 1,
            "renderOrder" : 6,
            "scale" : 0.4627031385898590
        },
        
        {
            "aspectScale" : 1,
            "body" : 4,
            "center" : 
            {
                "x" : 0.02851789817214012,
                "y" : -0.0009155124425888062
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.08596524596214294,
                    0.1430010497570038,
                    0.1430010497570038,
                    -0.08596524596214294
                ],
                "y" : 
                [
                    -0.1153986603021622,
                    -0.1153986603021622,
                    0.1135676354169846,
                    0.1135676354169846
                ]
            },
            "file" : "../../img/Characters/Chuck/lowerLeftLeg.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.08596524596214294,
                -0.1153986603021622,
                0.1430010497570038,
                -0.1153986603021622,
                0.1430010497570038,
                0.1135676354169846,
                -0.08596524596214294,
                0.1135676354169846
            ],
            "name" : "image5",
            "opacity" : 1,
            "renderOrder" : 6,
            "scale" : 0.2289662957191467
        },
        
        {
            "aspectScale" : 1,
            "body" : 2,
            "center" : 
            {
                "x" : 0.01975236460566521,
                "y" : -0.07194232940673828
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.2679373621940613,
                    0.3074420690536499,
                    0.3074420690536499,
                    -0.2679373621940613
                ],
                "y" : 
                [
                    -0.4171699881553650,
                    -0.4171699881553650,
                    0.2732853293418884,
                    0.2732853293418884
                ]
            },
            "file" : "../../img/Characters/Chuck/head.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.2679373621940613,
                -0.4171699881553650,
                0.3074420690536499,
                -0.4171699881553650,
                0.3074420690536499,
                0.2732853293418884,
                -0.2679373621940613,
                0.2732853293418884
            ],
            "name" : "image1",
            "opacity" : 1,
            "renderOrder" : 6,
            "scale" : 0.6904553174972534
        },
        
        {
            "aspectScale" : 1,
            "body" : 0,
            "center" : 
            {
                "x" : 0.002138927578926086,
                "y" : 0.0006600618362426758
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.05653338506817818,
                    0.06081124022603035,
                    0.06081124022603035,
                    -0.05653338506817818
                ],
                "y" : 
                [
                    -0.2340291887521744,
                    -0.2340291887521744,
                    0.2353493124246597,
                    0.2353493124246597
                ]
            },
            "file" : "../../img/Characters/Chuck/upperLeftArm.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.05653338506817818,
                -0.2340291887521744,
                0.06081124022603035,
                -0.2340291887521744,
                0.06081124022603035,
                0.2353493124246597,
                -0.05653338506817818,
                0.2353493124246597
            ],
            "name" : "image4",
            "opacity" : 1,
            "renderOrder" : 8,
            "scale" : 0.4693785011768341
        },
        
        {
            "aspectScale" : 1,
            "body" : 5,
            "center" : 
            {
                "x" : 0.002538725733757019,
                "y" : 0.001779437065124512
            },
            "corners" : 
            {
                "x" : 
                [
                    -0.05412428826093674,
                    0.05920173972845078,
                    0.05920173972845078,
                    -0.05412428826093674
                ],
                "y" : 
                [
                    -0.1398780941963196,
                    -0.1398780941963196,
                    0.1434369683265686,
                    0.1434369683265686
                ]
            },
            "file" : "../../img/Characters/Chuck/lowerLeftArm.png",
            "filter" : 0,
            "glDrawElements" : [ 0, 1, 2, 2, 3, 0 ],
            "glTexCoordPointer" : [ 0.0, 0.0, 1, 0.0, 1, 1, 0.0, 1 ],
            "glVertexPointer" : 
            [
                -0.05412428826093674,
                -0.1398780941963196,
                0.05920173972845078,
                -0.1398780941963196,
                0.05920173972845078,
                0.1434369683265686,
                -0.05412428826093674,
                0.1434369683265686
            ],
            "name" : "image3",
            "opacity" : 1,
            "renderOrder" : 8,
            "scale" : 0.2833150625228882
        }
    ],
    "joint" : 
    [
        
        {
            "anchorA" : 
            {
                "x" : 0.001047849655151367,
                "y" : -0.1790249347686768
            },
            "anchorB" : 
            {
                "x" : 0.001048207283020020,
                "y" : 0.08683943748474121
            },
            "bodyA" : 0,
            "bodyB" : 5,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : 0,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint4",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 1.919862151145935
        },
        
        {
            "anchorA" : 
            {
                "x" : -0.1165831685066223,
                "y" : 0.3330366015434265
            },
            "anchorB" : 
            {
                "x" : -2.135336399078369e-05,
                "y" : 0.1812803745269775
            },
            "bodyA" : 1,
            "bodyB" : 0,
            "enableLimit" : false,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -2.268928050994873,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint3",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 3.141592741012573
        },
        
        {
            "anchorA" : 
            {
                "x" : 0.07454992830753326,
                "y" : 0.5068108439445496
            },
            "anchorB" : 
            {
                "x" : -0.02141102217137814,
                "y" : -0.3435407876968384
            },
            "bodyA" : 1,
            "bodyB" : 2,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -1.221730470657349,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint0",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 0.6981316804885864
        },
        
        {
            "anchorA" : 
            {
                "x" : 0.1367489844560623,
                "y" : -0.3606387376785278
            },
            "anchorB" : 
            {
                "x" : 0.05056380107998848,
                "y" : 0.1842886805534363
            },
            "bodyA" : 1,
            "bodyB" : 7,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -0.6981316804885864,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint5",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 1.919862151145935
        },
        
        {
            "anchorA" : 
            {
                "x" : -0.08329562842845917,
                "y" : -0.3541148304939270
            },
            "anchorB" : 
            {
                "x" : -0.05503869056701660,
                "y" : 0.1909851431846619
            },
            "bodyA" : 1,
            "bodyB" : 8,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -0.6981316804885864,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint6",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 1.919862151145935
        },
        
        {
            "anchorA" : 
            {
                "x" : 0.1710196435451508,
                "y" : 0.3308989405632019
            },
            "anchorB" : 
            {
                "x" : -9.131431579589844e-05,
                "y" : 0.1791421175003052
            },
            "bodyA" : 1,
            "bodyB" : 6,
            "enableLimit" : false,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -2.268928050994873,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint2",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 3.141592741012573
        },
        
        {
            "anchorA" : 
            {
                "x" : 0.0004334598779678345,
                "y" : 0.08706557750701904
            },
            "anchorB" : 
            {
                "x" : 0.0004332214593887329,
                "y" : -0.1787990331649780
            },
            "bodyA" : 3,
            "bodyB" : 6,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : 0,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint1",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 1.919862151145935
        },
        
        {
            "anchorA" : 
            {
                "x" : 0.002425249665975571,
                "y" : -0.1845821887254715
            },
            "anchorB" : 
            {
                "x" : 0.002425376325845718,
                "y" : 0.1026860624551773
            },
            "bodyA" : 7,
            "bodyB" : 9,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -2.268928050994873,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint8",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 0
        },
        
        {
            "anchorA" : 
            {
                "x" : -0.0009558200836181641,
                "y" : -0.1818936169147491
            },
            "anchorB" : 
            {
                "x" : -0.0009555891156196594,
                "y" : 0.1055182516574860
            },
            "bodyA" : 8,
            "bodyB" : 4,
            "enableLimit" : true,
            "enableMotor" : false,
            "jointSpeed" : 0,
            "lowerLimit" : -2.268928050994873,
            "maxMotorTorque" : 1,
            "motorSpeed" : 0,
            "name" : "joint7",
            "refAngle" : 0,
            "type" : "revolute",
            "upperLimit" : 0
        }
    ],
    "positionIterations" : 3,
    "stepsPerSecond" : 60.0,
    "subStepping" : false,
    "velocityIterations" : 8,
    "warmStarting" : true
}





 
    return Rube;
 
});