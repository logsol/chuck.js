Chuck.Loader.Level = function(engine) {
    this._engine = engine;
    this.init();
}

Chuck.Loader.Level.prototype.init = function() {
    this.load();
}

Chuck.Loader.Level.prototype.load = function() {
    $.get('xml/level.xml', $.proxy(this.process, this));
}

Chuck.Loader.Level.prototype.process = function(xml) {
    var objects, tile;
    
    objects = $(xml).find('tile');
    for (var i = 0; i < objects.length; i++) {
        
        var tile = {
            shape: objects[i].attributes.shape 
                ? parseInt(objects[i].attributes.shape.value)
                : 1,
            x: objects[i].attributes.x
                ? parseInt(objects[i].attributes.x.value) * Chuck.Settings.TILE_SIZE
                : 0,
            y: objects[i].attributes.y
                ? parseInt(objects[i].attributes.y.value) * Chuck.Settings.TILE_SIZE
                : 0,
            rotation: objects[i].attributes.rotation 
                ? parseInt(objects[i].attributes.rotation.value)
                : 0
        }
        this.createPhysicTile(tile);
    }
}

Chuck.Loader.Level.prototype.generateAllTiles = function() {
    // GENERATING ALL POSSIBLE TILE SHAPES
    var xpos= 185;
    var ypos = 150;
    var space = 0;

    for (var i = 0; i < 8; i++)
    {
        for (var r = 0; r < 4; r++)
        {
            this.createPhysicTile(i+1, xpos + r * (Chuck.Settings.TILE_SIZE + space), ypos + i * (Chuck.Settings.TILE_SIZE + space), r);
        }
    }
}


Chuck.Loader.Level.prototype.createPhysicTile = function(tile) {
    if(tile.rotation == undefined){
        tile.rotation = 0;
    }
    
    var tileSize = Chuck.Settings.TILE_SIZE;
    var vertices = [];
    switch(tile.shape) {
        case 1:
            vertices[0] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //  o o o
            vertices[1] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //  o o o
            vertices[2] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o o
            vertices[3] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);
            break;

        case 2:
            vertices[0] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //  o
            vertices[1] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o  
            vertices[2] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o o
            break;

        case 3:
            vertices[0] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //  o
            vertices[1] = new Chuck.b2Vec2( 0,                              tileSize / 2 / Chuck.Settings.RATIO);  //  o 
            vertices[2] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o
            break;

        case 4:
            vertices[0] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //  o 
            vertices[1] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO, 0                             );  //  o o o 
            vertices[2] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o o 
            vertices[3] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);
            break;

        case 5:
            vertices[0] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //      o
            vertices[1] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //      o
            vertices[2] = new Chuck.b2Vec2( 0                            ,  tileSize / 2 / Chuck.Settings.RATIO);  //    o o
            break;

        case 6:
            vertices[0] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);  //      o
            vertices[1] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o o
            vertices[2] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o o
            vertices[3] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  0                   );
            break;

        case 7:
            vertices[0] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  0                            );  //        
            vertices[1] = new Chuck.b2Vec2( 0                            ,  tileSize / 2 / Chuck.Settings.RATIO);  //  o    
            vertices[2] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);  //  o o      
            break;

        case 8:
            vertices[0] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO, -tileSize / 2 / Chuck.Settings.RATIO);//  o o   
            vertices[1] = new Chuck.b2Vec2( 0                            , -tileSize / 2 / Chuck.Settings.RATIO);//  o o o  
            vertices[2] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  0                          );  //  o o o    
            vertices[3] = new Chuck.b2Vec2( tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);   
            vertices[4] = new Chuck.b2Vec2(-tileSize / 2 / Chuck.Settings.RATIO,  tileSize / 2 / Chuck.Settings.RATIO);   
            break;

        default:
            break;
    }

    var bodyDef = new Chuck.b2BodyDef();
    bodyDef.type = Chuck.b2Body.b2_staticBody;
    bodyDef.position.x = tile.x / Chuck.Settings.RATIO;
    bodyDef.position.y = tile.y / Chuck.Settings.RATIO;
    bodyDef.angle = tile.rotation * 90 * Math.PI / 180;

    var tileShape = new Chuck.b2PolygonShape;
    
    tileShape.SetAsArray(vertices, vertices.length);

    var fixtureDef = new Chuck.b2FixtureDef();
    fixtureDef.shape = tileShape;
    fixtureDef.density = 0;
    fixtureDef.friction = Chuck.Settings.TILE_FRICTION;
    fixtureDef.restitution = Chuck.Settings.TILE_RESTITUTION;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'tile';

    var body = this._engine.createBody(bodyDef);
    body.CreateFixture(fixtureDef);
}
