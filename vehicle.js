class Vehicle extends EngineObject 
{
    tileInfo;

    constructor(minVelocity, maxVelocity, lane, tileInfo)
    {
        super(); // set object position

        const width = 5;
        const height = 2

        this.velocity = vec2(rand(minVelocity, maxVelocity), 0);

        this.size = vec2(width, height);
        this.pos = vec2(-10, lane - height / 2); 
        this.color = randColor();

        this.setCollision();

        this.mass = 0;
        this.tileInfo = tileInfo;

        this.mirror = true;
    }
  
    collideWithObject(obj) {
      if (obj !== _FOTL.player) return;
      _FOTL.currentState = _FOTL.states.gameOver;
      _FOTL.gameOverReason = 'Crashed';
    }

  render() {
    drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle, this.mirror, this.additiveColor);
  }

    update() {
      if (isPaused()) return;
      this.pos.x += this.velocity.x;

      if (this.pos.x > 40) {
        this.destroy();
      }

      super.update();
    }
}

class EasyVehicle extends Vehicle {
  constructor(lane) {
    const sprite = gameSprites.filter(x => x.key === 'easy').shift().sprites[0].tileInfo;//chooseSprite('easy');
    // const sprite = chooseSprite('easy');
    super(.03, .05, lane, sprite);
  }
}

class MediumVehicle extends Vehicle {
  constructor(lane) {
    const sprite = gameSprites.filter(x => x.key === 'medium').shift().sprites[0].tileInfo;//chooseSprite('easy');
    super(.05, .08, lane, sprite);
  }
}

class HardVehicle extends Vehicle {
  constructor(lane) {
    const sprite = gameSprites.filter(x => x.key === 'hard').shift().sprites[0].tileInfo;//chooseSprite('easy');
    super(.12, .15, lane,sprite);
  }
}

class FallingVehicle extends Vehicle {
  constructor(lane) {
    const sprite = gameSprites.filter(x => x.key === 'falling').shift().sprites[0].tileInfo;//chooseSprite('easy');
    super(.04, .07, 19,sprite);

    this.mass = rand(.1, .6);
    this.gravityScale = .05;
  }
}
