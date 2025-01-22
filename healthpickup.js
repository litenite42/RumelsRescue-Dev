class Health extends Item {
  healsFor;
  pEmitter;

  constructor(obj) {
    super();

    let {h, l} = {...obj};

    this.mass = 0.5;
    this.gravityScale = 0.001;
    this.velocity.x = rand(0.05, 0.08);

    this.pos.x = randInt(-3, 5);
    // this.pos.y = randInt(15, 19);
    this.pos.y = l;

    this.healsFor = h;
    this.setCollision(true);
    let sprite = 0;
if (!sprite) { 
    sprite = chooseSprite('healthpickup');
    }
    this.tileInfo = sprite;
    this.pEmitter =
      new ParticleEmitter(this.pos, 0, 0.75, 0.3, 143, 3.14, undefined, new Color(0.063, 0.969, 0.059, 0.4), new Color(0.282, 0.82, 0.988, 1), new Color(0.149, 0.635, 0.412, 0), new Color(0.965, 0.961, 0.957, 0), 0.4, 0.4, 0.7, 0.13, 0.05, 1, 1, 0, 3.14, 0.1, 0.2, 0, 0, 1);

    this.addChild(this.pEmitter);
  }

  collideWithObject(obj) {
    obj && obj.heal && obj.heal(this.healsFor);
    obj === _FOTL.player && this.destroy();
  }

  update() {
    super.update();
    // this.pEmitter.pos = this.pos;
    const offScreen = this.pos.y < 0 || this.pos.x > 40;

    if (!offScreen) return; 
    
    this.destroy();
    _FOTL.pickups.health.count--;
  }

/*  render() {
    super.render();
  }*/
}

(() => {
  function resetHealthPickups() {
    _FOTL.pickups.health.count = 0;
  }

  function initHealthPickups() {
    _FOTL.pickups = {};
    _FOTL.pickups.health = {};

    _FOTL.pickups.health.laneSelector = new LaneSelector();
    _FOTL.pickups.health.reset = resetHealthPickups;

    const diffs = _FOTL.difficulties;

    _FOTL.pickups.health.SpawnRate = [];
    _FOTL.pickups.health.SpawnRate[diffs.easy] = 10;
    _FOTL.pickups.health.SpawnRate[diffs.medium] = 15;
    _FOTL.pickups.health.SpawnRate[diffs.hard] = 20;

    _FOTL.pickups.health.Max = [];
    _FOTL.pickups.health.Max[diffs.easy] = 5;
    _FOTL.pickups.health.Max[diffs.medium] = 4;
    _FOTL.pickups.health.Max[diffs.hard] = 3;

    _FOTL.pickups.health.count = 0;
const healthSpriteSheetData ={
  "key": "healthpickup",
  "sprites": [
    {
      "fileName": "healthpickup.png",
      "width": 64,
      "height": 64,
      "x": 0,
      "y": 0
    },
    {
      "fileName": "healthpickup.png",
      "width": 64,
      "height": 64,
      "x": 65,
      "y":0 
    },
    {
      "fileName": "healthpickup.png",
      "width": 64,
      "height": 64,
      "x": 0,
      "y":5 
    },
    {
      "fileName": "healthpickup.png",
      "width": 64,
      "height": 64,
      "x": 65,
      "y":65 
    }
  ],
  "packMode": "grid",
  "padding": 0,
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "spriteSheetWidth": 128,
  "spriteSheetHeight": 128
};
    spriteSheetData.push(healthSpriteSheetData);
    spriteSheets.names.push('healthpickup');
  }

  function spawnHealthPickup() {
    const difficulty = _FOTL.currentDifficulty;
    const spawnRate = _FOTL.pickups.health.SpawnRate[difficulty];

    const shouldSpawn =
      _FOTL.score % spawnRate == 0 &&
      _FOTL.player &&
      _FOTL.player.health < 3 &&
      _FOTL.pickups.health.count < _FOTL.pickups.health.Max[difficulty];

    if (!shouldSpawn) return;

    const healsFor = randInt(1, 2);
    const lane = _FOTL.pickups.health.laneSelector.New();

    new Health({ h: healsFor, l: lane});

    _FOTL.pickups.health.count++;
  }

  _FOTL.addExt("pickups.health", spawnHealthPickup , initHealthPickups);
})();
