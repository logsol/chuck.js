/*
 * Licensed under the MIT License
 * Copyright (c) Erin Catto
 */

// TODO_ERIN test joints on compounds.
planck.testbed('CompoundShapes', function(testbed) {
  var pl = planck, Vec2 = pl.Vec2, Transform = pl.Transform;
  var world = new pl.World(Vec2(0, -10));

  world.createBody(Vec2(0.0, 0.0)).createFixture(pl.Edge(Vec2(50.0, 0.0), Vec2(-50.0, 0.0)), 0.0);

  var headshape = pl.Circle(Vec2(0.0, 1.0), 0.5);
  var legsshape = pl.Circle(Vec2(0.0, -1.0), 0.5);
  var bodyshape = pl.Box(0.25, 0.5);

  // Create one body with circles and polygons
  var body = world.createDynamicBody({
    position : Vec2(pl.Math.random(-0.1, 0.1), 1.05),
    angle : pl.Math.random(-Math.PI, Math.PI)
  });
  body.createFixture(headshape, 2.0);
  body.createFixture(legsshape, 0.0);
  body.createFixture(bodyshape, 2.0);

  return world;
});
