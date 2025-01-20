class Item extends EngineObject {
  constructor() {
    super();
    if (this.constructor == Item) {
      throw new Error("Abstract instantiation not permitted.");
    }
  }

  collideWithObject(obj) {}

  update() {
    if (isPaused()) return;
    super.update();
  }
  operate(obj) {
    throw new Error("Operate method must be provided.");
  }
}


