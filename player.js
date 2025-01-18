class Player extends EngineObject {
  health;
  guardrailTimer;

  constructor(sizeOfLevel, sprite) {
    super();

    this.health = 3;
    this.guardrailTimer = 0;

    const initY = randInt(4, 8);
    const midX = sizeOfLevel.x / 2;
    const hardRegion = [5, 14];
    const mediumRegion = [15, 25];
    const easyRegion = [26, 33];

    let region;

    if (_FOTL.uiManager.difficulty === _FOTL.difficulties.easy) {
      region = easyRegion;
    } else if (_FOTL.uiManager.difficulty === _FOTL.difficulties.medium) {
      region = mediumRegion;
    } else {
      region = hardRegion;
    }

    const initX = randInt(region[0], region[1]);

    this.pos = vec2(initX, initY);
    this.size = vec2(4, 2);
    this.color = new Color().setHex("#bbbbbb");

    this.gravityScale = 1;
    this.mass = 0;
    this.setCollision();
    if (!sprite) { 
// const ndx = randInt(0,1);
// const choice = gameSprites.filter(g => g.key == 'bikes').shift();
//
  // sprite = choice?.sprites[ndx];
      sprite = chooseSprite('player');
    }
    this.tileInfo = sprite;
    
    this.mass = 1;
    // apply an initial upwards (rightwards) force to start player off
    this.applyForce(vec2(0, rand(.3, .5)));

    this.mirror = true;
  }

  heal(healFor) {
    this.health += healFor;
  }

  render() {
    drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle, this.mirror, this.additiveColor);
  }

  update() {
    if (isPaused()) return;
    if (_FOTL.currentState == _FOTL.states.gameOver || _FOTL.currentState == _FOTL.states.spinout) return;

    let y = this.pos.y;

    const adjustment = 1.1 * this.size.y;
    const minVal = 1;
    const maxVal = 19;

    const playerMoved =
      keyIsDown("KeyW") || keyIsDown("ArrowUp") || mouseIsDown(0);

    if (playerMoved) {
      _FOTL.lastPlayerActivityFrame = frame;

      this.applyForce(vec2(0, 1 / 60));
      this.mass = 1;
      this.angle = PI/8;
    } else {
      this.angle = 0;
    }
    const againstGuardrails = this.pos.y >= maxVal || this.pos.y <= minVal;

    if (againstGuardrails && !this.guardrailTimer) {
      this.guardrailTimer = new Timer(5.4);
    } else if (againstGuardrails && this.guardrailTimer && this.guardrailTimer.elapsed()) {
      this.health--; 
      this.guardrailTimer = undefined;
    } else if (!againstGuardrails && this.guardrailTimer && this.guardrailTimer.active()) {
      this.guardrailTimer.unset();
      this.guardrailTimer = undefined;
    }

    if (this.health <= 0) {
      _FOTL.currentState = _FOTL.states.spinout;
      _FOTL.gameOverReason = "spun out against the guard rail";
    }

    this.velocity.y = clamp(this.velocity.y, -2, 2);
    this.pos.y = clamp(this.pos.y, minVal, maxVal);

    super.update();
  }

  damage(damage = 1) {
    this.health -= damage;
  }
}
