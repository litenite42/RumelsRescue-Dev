"use strict";


  function gameReset(gameOver) {
  engineObjectsDestroy();

  _FOTL.player = new Player(levelSize,playerSprite);
  _FOTL.score = 0;
  _FOTL.currentState = _FOTL.states.running;
  _FOTL.currentlyPlaying = "";

    if (_FOTL.uiManager.visible)
      _FOTL.uiManager.toggleGameOver(false);

    _FOTL.resetExts();
}
///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  _FOTL.soundtrack = _FOTL.music.map((x) => new SoundWave(x));

  gravity = -0.008333;
  _FOTL.uiManager = new uiManager();

  const bikeSettings = {
    name: 'bikes',
    sourceFormat: 'png',
    atlasFormat: 'json'
  };

  gameSprites = (() => {
  return spriteSheets?.names.map((sheetData, ndx, arr) => {
    const specifiedSheet = spriteSheetData.filter(s => s.key == sheetData).shift();
    return new SpriteSheet(specifiedSheet.sprites, sheetData, `${spriteSheets.base}${sheetData}.${spriteSheets.imageFormat}`, ndx);
  });  
})();

  numberHealthsAvailable = 0;
  numberPotHoles = 0;
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  if (
    _FOTL.currentState === _FOTL.states.menu ||
    _FOTL.currentState === _FOTL.states.intro
  ) {
    return;
  }

  if (keyWasPressed("KeyR")) {
    gameReset();

    return;
  }

  if (_FOTL.currentState == _FOTL.states.gameOver) {
    engineObjectsDestroy();
 
    _FOTL.currentlyPlaying  && _FOTL.currentlyPlaying.stop();
    return;
  }

  if (keyWasPressed("KeyP")) {
    _FOTL.currentState =
      _FOTL.currentState == _FOTL.states.paused
        ? _FOTL.states.running
        : _FOTL.states.paused;

    if (isPaused()) {
      _FOTL.currentlyPlaying && _FOTL.currentlyPlaying.stop();
    } else { 
      !_FOTL.uiManager.mute && _FOTL.currentlyPlaying.play(0, 0.6, 1, 0, true);
    }

    _FOTL.uiManager.togglePause();
    _FOTL.lastPlayerActivityFrame = frame;
    return;
  }

  if (isPaused()) return;

  const colors = Object.getOwnPropertyNames(_FOTL.palette);

  if (frame % 99 == 0) {
    _FOTL.score++;

    if (!!_FOTL.uiManager.punishLazy) {
      _FOTL.score += _FOTL.uiManager.difficulty / 10;
    }
  }

  // if (numberHealthsAvailable < 3 && _FOTL.player && _FOTL.player.health < 3 && _FOTL.score % 10 === 0) {
    // new Health(2);
    // numberHealthsAvailable++;
  // }

  _FOTL.runExts();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render

  if (!_FOTL.vehicleFactory && _FOTL.uiManager.difficulty) {
    _FOTL.vehicleFactory = new VehicleFactory({
      difficulty: _FOTL.uiManager.difficulty,
    });
  }

  if (!_FOTL.player && _FOTL.uiManager.difficulty) {
    _FOTL.player = new Player(levelSize, playerSprite);
    _FOTL.player.name = _FOTL.uiManager.playerName;
  }

  if (_FOTL.player) handleMedals();
  if (_FOTL.currentState !== _FOTL.states.running) return;
  if (!_FOTL.uiManager.mute && !_FOTL.currentlyPlaying) {
    _FOTL.soundtrack[0].play(0, 0.6, 1, 0, true);

    _FOTL.currentlyPlaying = _FOTL.soundtrack[0];
  }

  if (
    !!_FOTL.uiManager.punishLazy &&
    frame - _FOTL.lastPlayerActivityFrame > 170
  ) {
    _FOTL.player.applyForce(vec2(0, 4));
    _FOTL.lastPlayerActivityFrame = frame;
  }


  _FOTL.vehicleFactory.New();

}

function handleMedals() {
  if (_FOTL.uiManager.difficulty == _FOTL.difficulties.easy){
    easyStart.unlock();
  } else if (_FOTL.uiManager.difficulty == _FOTL.difficulties.medium) {
    mediumStart.unlock();
  } else if (_FOTL.uiManager.difficulty == _FOTL.difficulties.hard) {
    hardStart.unlock();
  }

  if (_FOTL.score >= 100) {
    hundredPoints.unlock();
  } else if (_FOTL.score >= 75) {
    seventyFivePoints.unlock();
  } else if (_FOTL.score >= 50) {
    fiftyPoints.unlock();
  } else if (_FOTL.score >= 25) {
    twentyFivePoints.unlock();
  } else if (_FOTL.score >= 10) {
   firstSteps.unlock();
  }

  if (_FOTL.player.pos.y < 1) {
    leftLegDamage.unlock();
  } else if (_FOTL.player.pos.y > 19) {
    rightLegDamage.unlock();
  }

  if (_FOTL.player.health == 2) {
    firstHealth.unlock();
  } else if (_FOTL.player.health == 1) {
    secondHealth.unlock()
  } else if (!_FOTL.player.health) {
    finalHealth.unlock();
  }
}

function drawLane(height, thickness, color) {
  const sectionLength = 38/10;

  for (let section = -1; section < 10; section++) {
    const multi = (frame % 16) * (sectionLength / 32)
    const addon = (_FOTL.currentState === _FOTL.states.running) ? multi : 0;
    const placement = section + addon;

    const sectionStart = vec2(placement * sectionLength, height);
    const sectionEnd = vec2((placement + 1) * sectionLength, height);

    const useColor = section % 2 && frame % 2 ? color : GRAY;
    drawLine(sectionStart, sectionEnd, thickness, useColor);
  }
}

///////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
  let x = mainCanvasSize.x / 2;
  let y = (-1 * mainCanvasSize.y) / 2;

  drawRect(cameraPos, mainCanvasSize.scale(0.8), _FOTL.bgColor);
  drawRect(cameraPos, vec2(mainCanvasSize.x, 20), GRAY);

  drawLine(vec2(-1, 20), vec2(40, 20), 0.5, new Color().setHex("#AAAAAA"));
  drawLine(vec2(-1, 0), vec2(40, 0), 0.5, new Color().setHex("#AAAAAA"));

  for (let currLane = 5; currLane < 19; currLane += 5) {
    drawLane(currLane, 0.1, WHITE);
  }

  if (debug) {
    drawLine(vec2(0, 24.5), vec2(38, 24.5), 0.1, new Color().setHex("#000000"));
    drawLine(vec2(0, 19.5), vec2(38, 19.5), 0.1, new Color().setHex("#000000"));
    drawLine(vec2(0, 19.5), vec2(0, 0), 0.1, new Color().setHex("#000000"));
    drawLine(vec2(0, 0), vec2(5, 0), 0.1, new Color().setHex("#FF0000"));
    drawLine(vec2(0, 5), vec2(5, 5), 0.1, new Color().setHex("#00FF00"));
    drawLine(vec2(0, 10), vec2(5, 10), 0.1, new Color().setHex("#0000FF"));
    drawLine(vec2(0, 15), vec2(5, 15), 0.1, new Color().setHex("#000000"));
  }
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  if ((_FOTL.currentState == _FOTL.states.gameOver || _FOTL.currentState == _FOTL.states.spinout) && !_FOTL.uiManager.visible) {
    _FOTL.uiManager.toggleGameOver();
  }

  if (_FOTL.currentState == _FOTL.states.gameOver) {
    return;
  }

  if (!_FOTL.player) return;

  drawTextScreen(
    "Rumel's Rescue",
    vec2(164, 20),
    24,
    new Color().setHex("#000000"),
  );

  drawTextScreen(
    "Health: " + _FOTL.player.health,
    vec2(764, 20),
    24,
    new Color().setHex("#000000"),
  );

  drawTextScreen(
    "Score: " + _FOTL.score,
    vec2(884, 20),
    24,
    new Color().setHex("#000000"),
  );

  if (debug) {
    drawText(`(${_FOTL.player.pos.x}, ${_FOTL.player.pos.y})`,
    vec2(_FOTL.player.pos.x, _FOTL.player.pos.y),
    3,
    RED);
  }
}

const configuredSprites = 
  spriteSheets.names?.map(s => `${spriteSheets.base}${s}.${spriteSheets.imageFormat}`) ?? [];

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  configuredSprites
  );
