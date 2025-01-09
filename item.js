class Item extends EngineObject {
  constructor() {
    if (this.constructor == Item) {
      throw new Error("Abstract instantiation not permitted.");
    }

  }

  collideWithObjects() {
    throw new Error("Collision detection must be implemented.");
  }

  operate() {
    throw new Error("Operate method must be provided.");
  }
}

class Health extends Item {
  constructor() {
    this.mass = .5;
    this.velocity.x = rand(.05, .08);

    this.pos.x = randInt(-3, 5);
    this.pos.y = randInt(15, 19);
  }


}
