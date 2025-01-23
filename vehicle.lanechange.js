class LaneChangeVehicle extends Vehicle {
  finalLane;

  constructor(startLane, endLane) {
    const sprite = gameSprites.filter((x) => x.key === "lane").shift()
      .sprites[0].tileInfo; //chooseSprite('easy');

    super(0.04, 0.07, 19, sprite);

    this.pos.y = startLane;
    this.finalLane = endLane;
  }

  update() {
    super.update();

    if (this.pos.x > 40 || this.pos.y < 0) {
      this.destroy();
      _FOTL.vehicles.lanechange.count--;

      return;
    }

    this.pos.y = lerp(1 / 120, this.pos.y, this.finalLane);
  }
}

(() => {
  function resetLaneChange() {
    _FOTL.vehicles.laneChange.count = 0;
  }

  function initLaneChange() {
    _FOTL.vehicles = {};
    _FOTL.vehicles.lanechange = {};

    _FOTL.vehicles.lanechange.laneSelector = new LaneSelector();
    _FOTL.vehicles.lanechange.reset = resetLaneChange;

    const diffs = _FOTL.difficulties;

    _FOTL.vehicles.lanechange.SpawnRate = [];
    _FOTL.vehicles.lanechange.SpawnRate[diffs.easy] = 30;
    _FOTL.vehicles.lanechange.SpawnRate[diffs.medium] = 24;
    _FOTL.vehicles.lanechange.SpawnRate[diffs.hard] = 12;

    _FOTL.vehicles.lanechange.Max = [];
    _FOTL.vehicles.lanechange.Max[diffs.easy] = 1;
    _FOTL.vehicles.lanechange.Max[diffs.medium] = 2;
    _FOTL.vehicles.lanechange.Max[diffs.hard] = 3;

    _FOTL.vehicles.lanechange.count = 0;
    const laneChangeSpriteSheetData = {
      key: "lane",
      sprites: [
        {
          fileName: "spr_camper_0.png",
          width: 288,
          height: 144,
          x: 0,
          y: 0,
        },
      ],
      packMode: "horizontal",
      padding: 0,
      backgroundColor: "rgba(0, 0, 0, 0)",
      spriteSheetWidth: 288,
      spriteSheetHeight: 144,
    };
    spriteSheetData.push(laneChangeSpriteSheetData);
    spriteSheets.names.push("lane");
  }

  function spawnLaneChange() {
    const difficulty = _FOTL.uiManager.difficulty;
    const spawnRate = _FOTL.vehicles.lanechange.SpawnRate[difficulty];

    console.debug(_FOTL.score && _FOTL.score % spawnRate);
    const shouldSpawn =
      _FOTL.score &&
      _FOTL.score % spawnRate == 0 &&
      _FOTL.player &&
      _FOTL.vehicles.lanechange.count <
        _FOTL.vehicles.lanechange.Max[difficulty];

    if (!shouldSpawn) return;

    const lane = _FOTL.vehicles.lanechange.laneSelector.New();
    const endLane = _FOTL.vehicles.lanechange.laneSelector.New();

    new LaneChangeVehicle(lane, endLane);

    _FOTL.vehicles.lanechange.count++;
  }

  _FOTL.addExt("vehicles.lanechange", spawnLaneChange, initLaneChange);
})();
