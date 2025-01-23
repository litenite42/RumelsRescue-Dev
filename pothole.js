class PotHole extends Item {
  damageFor;
  pEmitter;

  constructor(obj) {
    super();

    const { d, l } = { ...obj };

    this.velocity.x = rand(0.05, 0.08);
    this.setCollision(true);

    this.gravityScale = 0;

    this.damageFor = d;
    // this.color = BLACK;

    this.pos.x = randInt(-9, 8);
    this.pos.y = l;

    let sprite = 0;
    if (!sprite) {
      sprite = chooseSprite("pothole1");
    }
    this.tileInfo = sprite;
    this.pEmitter = new ParticleEmitter(
      this.pos,
      0,
      0.4,
      0.3,
      143,
      3.14,
      undefined,
      new Color(0.878, 0.106, 0.141, 1),
      new Color(0.878, 0.106, 0.141, 1),
      new Color(1, 0.471, 0, 0),
      new Color(0.965, 0.827, 0.176, 0),
      0.4,
      0.5,
      0.9,
      0.13,
      0.05,
      1,
      1,
      0,
      3.14,
      0.1,
      0.2,
      0,
      0,
      1,
    );

    this.addChild(this.pEmitter);
  }

  collideWithObject(obj) {
    obj &&
      obj === _FOTL.player &&
      _FOTL.player.damage &&
      _FOTL.player.damage(this.damageFor) &&
      this.destroy();
  }

  render() {
    drawTile(
      this.pos,
      this.size,
      this.tileInfo,
      this.color,
      this.angle,
      this.mirror,
      this.additiveColor,
    );
  }

  update() {
    super.update();

    if (this.pos.x <= 40) return;

    this.destroy();
    _FOTL.pothole.count--;
  }
}

(() => {
  function resetPotholes() {
    _FOTL.pothole.count = 0;
  }

  function initPotholes() {
    _FOTL.pothole = {};
    _FOTL.pothole.laneSelector = new LaneSelector();
    _FOTL.pothole.reset = resetPotholes;

    const diffs = _FOTL.difficulties;

    _FOTL.pothole.StartScores = [];
    _FOTL.pothole.StartScores[diffs.easy] = 20;
    _FOTL.pothole.StartScores[diffs.medium] = 16;
    _FOTL.pothole.StartScores[diffs.hard] = 12;

    _FOTL.pothole.SpawnRate = [];
    _FOTL.pothole.SpawnRate[diffs.easy] = 30;
    _FOTL.pothole.SpawnRate[diffs.medium] = 25;
    _FOTL.pothole.SpawnRate[diffs.hard] = 15;

    _FOTL.pothole.Max = [];
    _FOTL.pothole.Max[diffs.easy] = 3;
    _FOTL.pothole.Max[diffs.medium] = 4;
    _FOTL.pothole.Max[diffs.hard] = 5;

    _FOTL.pothole.count = 0;
    const potholeSpriteSheetData = {
      key: "pothole1",
      sprites: [
        {
          fileName: "pothole1.png",
          width: 64,
          height: 64,
          x: 0,
          y: 0,
        },
      ],
      packMode: "horizontal",
      padding: 0,
      backgroundColor: "rgba(0, 0, 0, 0)",
      spriteSheetWidth: 64,
      spriteSheetHeight: 64,
    };

    spriteSheetData.push(potholeSpriteSheetData);
    spriteSheets.names.push("pothole1");
  }

  function spawnPothole() {
    const difficulty = _FOTL.uiManager.difficulty;
    const startScore = _FOTL.pothole.StartScores[difficulty];
    const spawnRate = _FOTL.pothole.SpawnRate[difficulty];

    const shouldSpawn =
      _FOTL.score >= startScore &&
      _FOTL.score % spawnRate == 0 &&
      _FOTL.pothole.count < _FOTL.pothole.Max[difficulty];

    if (!shouldSpawn) return;

    const dmg = randInt(1, 2);
    const lane = _FOTL.pothole.laneSelector.New();

    new PotHole({ d: dmg, l: lane });

    _FOTL.pothole.count++;
  }

  _FOTL.addExt("pothole", spawnPothole, initPotholes);
})();
