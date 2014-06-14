define([
    "Game/Config/Settings",
    //"Lib/Vendor/Box2D/Box2D",
    "Lib/Vendor/Box2D/asmBox2d",
    //"Lib/Vendor/Box2D/helpers"
],

function (Settings, /*Box2dWeb, */AsmBox2d) {

    if(Settings.USE_ASM) {

        Box2D.Dynamics = {
            Controllers: {
                b2ControllerEdge: Module.b2ControllerEdge
            },
            Contacts: {
                b2CircleContact: Module.b2CircleContact
            },
            Joints: {
                b2DistanceJoint: Module.b2CircleContact
            },
            b2World: Module.b2World,
            b2ContactListener: Module.b2ContactListener,
            b2BodyDef: Module.b2BodyDef,
            b2FixtureDef: Module.b2FixtureDef,
            b2Body: Module.b2Body
        };
        Box2D.Common = {
            b2Color: Module.b2Color,
            Math: {
                b2Mat22: Module.b2Mat22,
                b2Vec2: Module.b2Vec2
            }
        }
        Box2D.Collision = {
            Shapes: {
                b2CircleShape: Module.b2CircleShape,
                b2PolygonShape: Module.b2PolygonShape
            }
        }

        Box2D.Dynamics.b2Body.b2_dynamicBody = Module.b2_dynamicBody;
        Box2D.Dynamics.b2Body.b2_staticBody = Module.b2_staticBody;
        

        // ---------------- ---------------- ---------------- ----------------

        function augmentProperties(object) {

            var properties = {};

            for(var key in object.prototype) {

                (function(){

                    var setterMatches = key.match(/^set_(.*)/);
                    var getterMatches = key.match(/^get_(.*)/);

                    if(setterMatches || getterMatches) {
                        var name = setterMatches ? setterMatches[1] : getterMatches[1];

                        if(typeof properties[name] !== 'object') {
                            properties[name] = {
                                setter: undefined,
                                getter: undefined
                            };
                        }

                        if(setterMatches) {
                            properties[name].setter = function(x){ 
                                //console.trace("here i am ", x, name);
                                this["set_" + name](x);
                            };
                        }

                        if(getterMatches) {
                            properties[name].getter = function(){ 
                                return this["get_" + name]() 
                            };
                        }
                    }
                })();
            }

            for(var name in properties) {
                Object.defineProperty(object.prototype, name, {
                    set: properties[name].setter,
                    get: properties[name].getter
                });
            }
        }

        augmentProperties(Box2D.Dynamics.b2BodyDef);
        augmentProperties(Box2D.Dynamics.b2FixtureDef);
        augmentProperties(Box2D.Common.Math.b2Vec2);

        // Merge helper functions
        /*for(var key in Helpers) {
            Box2D[key] = Helpers[key];
        }*/

        Box2D.createPolygonShape = function (vertices) {
            var shape = new Box2D.Collision.Shapes.b2PolygonShape();            
            var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
            var offset = 0;
            for (var i=0;i<vertices.length;i++) {
                Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
                Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
                offset += 8;
            }            
            var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
            shape.Set(ptr_wrapped, vertices.length);
            return shape;
        }
 
        Box2D.b2PolygonShape.prototype.SetAsOrientedBox = function(hx, hy, center, angle){ 
            return this.SetAsBox(hx, hy);
        }

        Box2D.Collision.Shapes.b2CircleShape.prototype.SetRadius = function(r) {
            return this.set_m_radius(r);
        }

        Box2D.Collision.Shapes.b2CircleShape.prototype.SetLocalPosition = function (position) {
            var p = this.get_m_p();
            p.set_x(position.x);
            p.set_y(position.y);
        }

        Box2D.Dynamics.b2Body.prototype.SetPosition = function (position) {
            var vec = new Box2D.Common.Math.b2Vec2(position.x, position.y);
            this.SetTransform(vec, this.GetAngle());
        }

        Box2D.Common.Math.b2Vec2.prototype.Copy = function () {
            return {
                x: this.get_x(),
                y: this.get_y()
            };
        }

        // var Box2D variable is global in AsmBox2d.js
        return Box2D;
    } 
        
    //return Box2dWeb;

});