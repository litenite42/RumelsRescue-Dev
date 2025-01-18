class Item extends EngineObject {
  constructor() {
    super();
    if (this.constructor == Item) {
      throw new Error("Abstract instantiation not permitted.");
    }
  }

  collideWithObject(obj) {
  }

  operate(obj) {
    throw new Error("Operate method must be provided.");
  }
}

class Health extends Item {
  healsFor;
  
  constructor(healsFor) {
    super();

    this.mass = .5;
    this.gravityScale = .001;
    this.velocity.x = rand(.05, .08);

    this.pos.x = randInt(-3, 5);
    this.pos.y = randInt(15, 19);

    this.healsFor = healsFor;
    this.setCollision(true); 
  }

  collideWithObject(obj) {
    obj && obj.heal && obj.heal(this.healsFor);
    obj === _FOTL.player && this.destroy();
  }

  update() {
    super.update();
    if (this.pos.y < 0 || this.pos.x > 40) { 
      this.destroy();
      numberHealthsAvailable--;
    }
  }
}
