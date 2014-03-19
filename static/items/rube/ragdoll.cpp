//Source code dump of Box2D scene: ragdoll.rube
//
//  Created by R.U.B.E 1.5.4
//  Using Box2D version 2.3.0
//  Sun February 16 2014 21:04:35
//
//  This code is originally intended for use in the Box2D testbed,
//  but you can easily use it in other applications by providing
//  a b2World for use as the 'm_world' variable in the code below.

b2Vec2 g(0.000000000000000e+00f, -1.000000000000000e+01f);
m_world->SetGravity(g);
b2Body** bodies = (b2Body**)b2Alloc(11 * sizeof(b2Body*));
b2Joint** joints = (b2Joint**)b2Alloc(9 * sizeof(b2Joint*));
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(-1.917114257812500e-01f, 1.433728694915771e+00f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[0] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(6.299880146980286e-02f, -2.545155882835388e-01f);
    vs[1].Set(6.299880146980286e-02f, 2.545149326324463e-01f);
    vs[2].Set(-6.299890577793121e-02f, 2.545149326324463e-01f);
    vs[3].Set(-6.299890577793121e-02f, -2.545155882835388e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[0]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(-6.397294998168945e-02f, 1.267420768737793e+00f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[1] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(1.883362084627151e-01f, -4.305148720741272e-01f);
    vs[1].Set(1.846363544464111e-01f, 5.393795371055603e-01f);
    vs[2].Set(1.850083470344543e-03f, 5.393795371055603e-01f);
    vs[3].Set(-1.883361339569092e-01f, 4.209862351417542e-01f);
    vs[4].Set(-1.883361339569092e-01f, -4.607573151588440e-01f);
    vs[5].Set(1.600667834281921e-03f, -4.952520132064819e-01f);
    shape.Set(vs, 6);

    fd.shape = &shape;

    bodies[1]->CreateFixture(&fd);
  }
  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(1.840525716543198e-01f, 4.875739216804504e-01f);
    vs[1].Set(1.840525716543198e-01f, 6.762337088584900e-01f);
    vs[2].Set(-4.607129842042923e-03f, 6.762337088584900e-01f);
    vs[3].Set(-4.607129842042923e-03f, 4.875739216804504e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[1]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(4.118728637695312e-02f, 2.199305295944214e+00f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[2] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 2.204959988594055e-01f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2CircleShape shape;
    shape.m_radius = 3.009769916534424e-01f;
    shape.m_p.Set(-8.219080045819283e-03f, 4.109379835426807e-03f);

    fd.shape = &shape;

    bodies[2]->CreateFixture(&fd);
  }
  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 2.204959988594055e-01f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2CircleShape shape;
    shape.m_radius = 2.723909914493561e-01f;
    shape.m_p.Set(-3.647049888968468e-02f, -1.517499983310699e-01f);

    fd.shape = &shape;

    bodies[2]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(1.235442161560059e-01f, 1.142371892929077e+00f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[3] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(6.299892067909241e-02f, -1.556134223937988e-01f);
    vs[1].Set(6.299892067909241e-02f, 1.556134223937988e-01f);
    vs[2].Set(-6.299898028373718e-02f, 1.556134223937988e-01f);
    vs[3].Set(-6.299898028373718e-02f, -1.556134223937988e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[3]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(-9.663248062133789e-02f, 3.554300665855408e-01f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[4] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(1.550966501235962e-01f, -1.253567039966583e-01f);
    vs[1].Set(1.550966501235962e-01f, -6.225190684199333e-02f);
    vs[2].Set(-9.268096834421158e-02f, -6.225190684199333e-02f);
    vs[3].Set(-9.268096834421158e-02f, -1.253567039966583e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[4]->CreateFixture(&fd);
  }
  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(9.449840337038040e-02f, -1.247676759958267e-01f);
    vs[1].Set(9.449840337038040e-02f, 1.715210527181625e-01f);
    vs[2].Set(-9.449829906225204e-02f, 1.715210527181625e-01f);
    vs[3].Set(-9.449829906225204e-02f, -1.247676759958267e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[4]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(-1.917138099670410e-01f, 1.142371892929077e+00f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[5] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(6.299891322851181e-02f, -1.556134223937988e-01f);
    vs[1].Set(6.299891322851181e-02f, 1.556134223937988e-01f);
    vs[2].Set(-6.299878656864166e-02f, 1.556134223937988e-01f);
    vs[3].Set(-6.299878656864166e-02f, -1.556134223937988e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[5]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(1.235442161560059e-01f, 1.433728694915771e+00f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[6] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(6.299892067909241e-02f, -2.545155882835388e-01f);
    vs[1].Set(6.299892067909241e-02f, 2.545149326324463e-01f);
    vs[2].Set(-6.299898028373718e-02f, 2.545149326324463e-01f);
    vs[3].Set(-6.299898028373718e-02f, -2.545155882835388e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[6]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(2.897095680236816e-02f, 6.702435612678528e-01f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[7] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(9.449830651283264e-02f, -2.537839412689209e-01f);
    vs[1].Set(9.449830651283264e-02f, 2.537844777107239e-01f);
    vs[2].Set(-9.449817240238190e-02f, 2.537844777107239e-01f);
    vs[3].Set(-9.449817240238190e-02f, -2.537839412689209e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[7]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(-9.663248062133789e-02f, 6.702435612678528e-01f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[8] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(9.449842572212219e-02f, -2.537839412689209e-01f);
    vs[1].Set(9.449842572212219e-02f, 2.537844777107239e-01f);
    vs[2].Set(-9.449826925992966e-02f, 2.537844777107239e-01f);
    vs[3].Set(-9.449826925992966e-02f, -2.537839412689209e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[8]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(2);
  bd.position.Set(2.897095680236816e-02f, 3.554300665855408e-01f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[9] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(1.550965905189514e-01f, -1.253567039966583e-01f);
    vs[1].Set(1.550965905189514e-01f, -6.225190684199333e-02f);
    vs[2].Set(-9.268099069595337e-02f, -6.225190684199333e-02f);
    vs[3].Set(-9.268099069595337e-02f, -1.253567039966583e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[9]->CreateFixture(&fd);
  }
  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(-1);
    b2PolygonShape shape;
    b2Vec2 vs[8];
    vs[0].Set(9.449830651283264e-02f, -1.247680261731148e-01f);
    vs[1].Set(9.449830651283264e-02f, 1.713046580553055e-01f);
    vs[2].Set(-9.449817240238190e-02f, 1.713046580553055e-01f);
    vs[3].Set(-9.449817240238190e-02f, -1.247680261731148e-01f);
    shape.Set(vs, 4);

    fd.shape = &shape;

    bodies[9]->CreateFixture(&fd);
  }
}
{
  b2BodyDef bd;
  bd.type = b2BodyType(0);
  bd.position.Set(3.118395805358887e-03f, -6.553649902343750e-03f);
  bd.angle = 0.000000000000000e+00f;
  bd.linearVelocity.Set(0.000000000000000e+00f, 0.000000000000000e+00f);
  bd.angularVelocity = 0.000000000000000e+00f;
  bd.linearDamping = 0.000000000000000e+00f;
  bd.angularDamping = 0.000000000000000e+00f;
  bd.allowSleep = bool(4);
  bd.awake = bool(2);
  bd.fixedRotation = bool(0);
  bd.bullet = bool(0);
  bd.active = bool(32);
  bd.gravityScale = 1.000000000000000e+00f;
  bodies[10] = m_world->CreateBody(&bd);

  {
    b2FixtureDef fd;
    fd.friction = 2.000000029802322e-01f;
    fd.restitution = 0.000000000000000e+00f;
    fd.density = 1.000000000000000e+00f;
    fd.isSensor = bool(0);
    fd.filter.categoryBits = uint16(1);
    fd.filter.maskBits = uint16(65535);
    fd.filter.groupIndex = int16(0);
    b2ChainShape shape;
    b2Vec2 vs[2];
    vs[0].Set(-4.179394245147705e+00f, 0.000000000000000e+00f);
    vs[1].Set(4.179394245147705e+00f, 0.000000000000000e+00f);
    shape.CreateChain(vs, 2);
    shape.m_prevVertex.Set(-1.998532295227051e+00f, -2.391039296991059e-23f);
    shape.m_nextVertex.Set(4.949933242915726e-38f, 3.363116314379561e-44f);
    shape.m_hasPrevVertex = bool(0);
    shape.m_hasNextVertex = bool(0);

    fd.shape = &shape;

    bodies[10]->CreateFixture(&fd);
  }
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[1];
  jd.bodyB = bodies[8];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(-9.128235280513763e-02f, -3.880688548088074e-01f);
  jd.localAnchorB.Set(-6.031601130962372e-02f, 2.092975974082947e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = -6.981316804885864e-01f;
  jd.upperAngle = 1.919862151145935e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[0] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[1];
  jd.bodyB = bodies[7];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(1.498610228300095e-01f, -3.952181935310364e-01f);
  jd.localAnchorB.Set(5.541206151247025e-02f, 2.019590735435486e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = -6.981316804885864e-01f;
  jd.upperAngle = 1.919862151145935e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[1] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[1];
  jd.bodyB = bodies[6];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(1.874177008867264e-01f, 3.626269102096558e-01f);
  jd.localAnchorB.Set(-1.000612974166870e-04f, 1.963189840316772e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(0);
  jd.lowerAngle = -2.268928050994873e+00f;
  jd.upperAngle = 3.141592741012573e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[2] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[1];
  jd.bodyB = bodies[0];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(-1.277616322040558e-01f, 3.649693727493286e-01f);
  jd.localAnchorB.Set(-2.339482307434082e-05f, 1.986622810363770e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(0);
  jd.lowerAngle = -2.268928050994873e+00f;
  jd.upperAngle = 3.141592741012573e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[3] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[8];
  jd.bodyB = bodies[4];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(-1.047469675540924e-03f, -1.993342936038971e-01f);
  jd.localAnchorB.Set(-1.047216355800629e-03f, 1.156357824802399e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = -2.268928050994873e+00f;
  jd.upperAngle = 0.000000000000000e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[4] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[0];
  jd.bodyB = bodies[5];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(1.148343086242676e-03f, -1.961904764175415e-01f);
  jd.localAnchorB.Set(1.148715615272522e-03f, 9.516614675521851e-02f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = 0.000000000000000e+00f;
  jd.upperAngle = 1.919862151145935e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[5] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[3];
  jd.bodyB = bodies[6];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(4.750192165374756e-04f, 9.541386365890503e-02f);
  jd.localAnchorB.Set(4.747509956359863e-04f, -1.959429979324341e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = 0.000000000000000e+00f;
  jd.upperAngle = 1.919862151145935e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[6] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[7];
  jd.bodyB = bodies[9];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(2.657793462276459e-03f, -2.022806107997894e-01f);
  jd.localAnchorB.Set(2.657927572727203e-03f, 1.125320196151733e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = -2.268928050994873e+00f;
  jd.upperAngle = 0.000000000000000e+00f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[7] = m_world->CreateJoint(&jd);
}
{
  b2RevoluteJointDef jd;
  jd.bodyA = bodies[1];
  jd.bodyB = bodies[2];
  jd.collideConnected = bool(0);
  jd.localAnchorA.Set(8.169807493686676e-02f, 5.554057359695435e-01f);
  jd.localAnchorB.Set(-2.346399985253811e-02f, -3.764809966087341e-01f);
  jd.referenceAngle = 0.000000000000000e+00f;
  jd.enableLimit = bool(1);
  jd.lowerAngle = -1.221730470657349e+00f;
  jd.upperAngle = 6.981316804885864e-01f;
  jd.enableMotor = bool(0);
  jd.motorSpeed = 0.000000000000000e+00f;
  jd.maxMotorTorque = 1.000000000000000e+00f;
  joints[8] = m_world->CreateJoint(&jd);
}
b2Free(joints);
b2Free(bodies);
joints = NULL;
bodies = NULL;

