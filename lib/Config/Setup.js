var Game = {
    Physics: {},
    
    b2Vec2 : Box2D.Common.Math.b2Vec2, 
    b2AABB : Box2D.Collision.b2AABB, 
    b2BodyDef : Box2D.Dynamics.b2BodyDef, 
    b2Body : Box2D.Dynamics.b2Body, 
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef, 
    b2Fixture : Box2D.Dynamics.b2Fixture, 
    b2World : Box2D.Dynamics.b2World, 
    b2MassData : Box2D.Collision.Shapes.b2MassData, 
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape, 
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape, 
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw, 
    b2MouseJointDef :  Box2D.Dynamics.Joints.b2MouseJointDef
};

Game.Settings = {
    STAGE_WIDTH : 600,
    STAGE_HEIGHT : 400,

    // BOX2D INITIALATORS
    RATIO : 35,
    BOX2D_WORLD_AABB_SIZE : 3000,
    BOX2D_ALLOW_SLEEP : true,
    BOX2D_GRAVITY : 16,
    BOX2D_VELOCITY_ITERATIONS : 5,
    BOX2D_POSITION_ITERATIONS : 5,
    BOX2D_TIME_STEP : 1 / 30,

    // GRAPHIC PATHS
    GRAPHICS_PATH : 'img',
    GRAPHICS_SUBPATH_ITEMS : 'Items',
    GRAPHICS_SUBPATH_CHARACTERS : 'Characters',

    TILE_SIZE : 15,

    // GAME PLAY 
    WALK_SPEED : 2.5,
    RUN_SPEED : 4.0,
    FLY_SPEED : 3.2,
    JUMP_SPEED : 3.0,

    // restitution : bouncyness, friction : rubbing, density : mass
    TILE_FRICTION : 0.99,
    TILE_RESTITUTION : 0.1,

    PLAYER_DENSITY : 0.96,
    PLAYER_FRICTION : 5,
    PLAYER_MOTION_FRICTION : 0,
    PLAYER_RESTITUTION : 0.0,
    PLAYER_LINEAR_DAMPING : .5,


    ITEM_DENSITY : 0.9,
    ITEM_FRICTION : 0.99,
    ITEM_RESTITUTION : 0.02
}