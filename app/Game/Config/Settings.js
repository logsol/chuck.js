define(function() {

    var Settings = {
        STAGE_WIDTH: 600,
        STAGE_HEIGHT: 400,

        // BOX2D INITIALATORS
        BOX2D_WORLD_AABB_SIZE: 3000,
        BOX2D_ALLOW_SLEEP: true,
        BOX2D_GRAVITY: 26,
        BOX2D_VELOCITY_ITERATIONS: 5,
        BOX2D_POSITION_ITERATIONS: 5,
        BOX2D_TIME_STEP: 1 / 60,

        //  PATHS
        GRAPHICS_PATH: 'static/img/',
        GRAPHICS_SUBPATH_ITEMS: 'Items/',
        GRAPHICS_SUBPATH_CHARACTERS: 'Characters/',
        GRAPHICS_SUBPATH_TILES: 'Tiles/',
        MAPS_PATH: 'static/maps/tiled/',

        RATIO: 21, //35
        // original tile size is 25 but we want it to resize to 20
        ORIGINAL_TILE_SIZE: 25,
        TILE_SIZE: 20,
        CAMERA_IS_ORTHOGRAPHIC: true,
        CAMERA_GLIDE: 12, // % of the way per frame
        VIEW_CONTROLLER: 0 ? 'Three' : 'Pixi',

        // GAME PLAY 
        WALK_SPEED: 4,
        RUN_SPEED: 8,
        FLY_SPEED: 6.2,
        JUMP_SPEED: 20,
        JUMP_STOP_DAMPING_FACTOR: 0.5,
        MAX_THROW_FORCE: 18 * 3.5,
        MAX_THROW_ANGULAR_VELOCITY: 0,
        MAX_RUNNING_WEIGHT: 9,
        RESPAWN_TIME: 512,
        HEALTH_DISPLAY_TIME: 2,
        RAGDOLL_DESTRUCTION_TIME: 250,

        // restitution: bouncyness, friction: rubbing, density: mass
        TILE_FRICTION: 0.99,
        TILE_RESTITUTION: 0.1,

        PLAYER_DENSITY: 3.68,
        PLAYER_FRICTION: 5,
        PLAYER_MOTION_FRICTION: 0.1,
        PLAYER_RESTITUTION: 0.0,
        PLAYER_LINEAR_DAMPING: 0.4,

        ITEM_DENSITY: 0.9,
        ITEM_FRICTION: 0.99,
        ITEM_RESTITUTION: 0.02,
        ITEM_LINEAR_DAMPING: 0.02,

        // BROWSER
        CANVAS_DOM_ID: 'canvasContainer',
        IS_BROWSER_ENVIRONMENT: typeof window !== 'undefined',
        USE_WEBGL: true,

        // NETWORKING
        WORLD_UPDATE_BROADCAST_INTERVAL: 70,
        CHANNEL_DESTRUCTION_TIME: 30,
        NETWORK_LOG_INCOMING: true,
        NETWORK_LOG_OUTGOING: false,
        NETWORK_LOG_FILTER: ['ping', 'pong', 'worldUpdate', 'lookAt'],

        // CHANNEL
        CHANNEL_END_ROUND_TIME: 4, //10,
        CHANNEL_DEFAULT_MAX_USERS: 40,
        CHANNEL_DEFAULT_SCORE_LIMIT: 10,
        CHANNEL_DEFAULT_LEVELS: ['stones2', 'debug', 'stones2', 'debug']
    }

    Settings.TILE_RATIO = Settings.ORIGINAL_TILE_SIZE / Settings.TILE_SIZE;

    return Settings;
});
