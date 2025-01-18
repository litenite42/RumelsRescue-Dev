class Item extends EngineObject {
  constructor() {
    super();
    if (this.constructor == Item) {
      throw new Error("Abstract instantiation not permitted.");
    }
  }

  collideWithObject(obj) {}

  operate(obj) {
    throw new Error("Operate method must be provided.");
  }
}

class PotHole extends Item {
  damageFor;

  constructor(damage) {
    super();

    this.velocity.x = rand(0.05, 0.08);
    this.setCollision(true);

    this.damageFor = damage;
    this.color = BLACK;
  }

  collideWithObject(obj) {
    obj &&
      obj === _FOTL.player &&
      _FOTL.player.damage &&
      _FOTL.player.damage(this.damageFor);
  }

  update() {
    super.update();

    if (this.pos.x > 40) {
      this.destroy();
      _FOTL.pothole.count--;
    }
  }
}

(() => {
  function initPotholes() {
    _FOTL.pothole = {};

    _FOTL.pothole.StartScores = [];
    _FOTL.pothole.StartScores[_FOTL.difficulties.easy] = 20;
    _FOTL.pothole.StartScores[_FOTL.difficulties.medium] = 16;
    _FOTL.pothole.StartScores[_FOTL.difficulties.hard] = 12;

    _FOTL.pothole.SpawnRate = [];
    _FOTL.pothole.SpawnRate[_FOTL.difficulties.easy] = 30;
    _FOTL.pothole.SpawnRate[_FOTL.difficulties.medium] = 25;
    _FOTL.pothole.SpawnRate[_FOTL.difficulties.hard] = 15;

    _FOTL.pothole.Max = [];
    _FOTL.pothole.Max[_FOTL.difficulties.easy] = 3;
    _FOTL.pothole.Max[_FOTL.difficulties.medium] = 4;
    _FOTL.pothole.Max[_FOTL.difficulties.hard] = 5;

    _FOTL.pothole.count = 0;
  }

  function spawnPothole() {
    const difficulty = _FOTL.currentDifficulty;
    const startScore = _FOTL.pothole.StartScores[difficulty];
    const spawnRate = _FOTL.pothole.SpawnRate[difficulty];

    const shouldSpawn =
      _FOTL.score >= startScore &&
      _FOTL.score % spawnRate == 0 &&
      _FOTL.numberPotholes < _FOTL.pothole.Max[difficulty];

    if (!shouldSpawn) return;

    const dmg = randInt(1, 2);
    new PotHole(dmg);

    _FOTL.pothole.count++;
  }

  _FOTL.addExt("PotHole", spawnPothole, initPotholes);
})();

class Health extends Item {
  healsFor;

  constructor(healsFor) {
    super();

    this.mass = 0.5;
    this.gravityScale = 0.001;
    this.velocity.x = rand(0.05, 0.08);

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
