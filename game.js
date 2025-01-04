"use strict";

const _FOTL = (() => {
  const palette = {
    red: new Color().setHex("#ff0000"),
    green: new Color().setHex("#009342"),
    white: new Color().setHex("#ffffff"),
  };


  const states = {
    menu: 0,
    intro: 10,
    running: 100,
    paused: 200,
    crashed: 300,
    spinOut: 400,
    stalledOut: 500,
    gameOver: -100,
  };

  const music = ["assets/music/01.mp3"];

  const difficulties = {
    easy: 10,
    medium: 20,
    hard: 30,
  };

  return {
    palette: palette,
    bgColor: palette.white,
    score: 0,
    states: states,
    currentState: states.menu,
    difficulties: difficulties,
    currentDifficulty: difficulties.easy,
    lastPlayerActivityFrame: -1,
    currentlyPlaying: "",
    music: music
  };
})();

const spriteSheets = {
  base: 'assets/images/',
  names: ['player', 'easy', 'medium', 'hard', 'falling'],
  imageFormat: 'png'
};
// https://chasersgaming.itch.io/2d-vehicle-sprite-1-20
//
// https://www.finalparsec.com/tools/sprite_sheet_maker
const bikesSpriteSheetData ={
  "key": "player",
  "sprites": [
    {
      "fileName": "ln_bike1.png",
      "width": 225,
      "height": 188,
      "x": 0,
      "y": 0
    },
    {
      "fileName": "spr_chopper_0.png",
      "width": 240,
      "height": 159,
      "x": 225,
      "y":0 
    }
  ],
  "packMode": "grid",
  "padding": 0,
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "spriteSheetWidth": 480,
  "spriteSheetHeight": 188
};

const easySpriteSheetData = {
  "key" : "easy",
  "sprites": [
    {
      "fileName": "ln_easy1.png",
      "width": 279,
      "height": 108,
      "x": 0,
      "y": 0
    },
    {
      "fileName": "ln_easy2.png",
      "width": 252,
      "height": 82,
      "x": 289,//519,
      "y": 0
    },
    {
      "fileName": "ln_easy3.png",
      "width": 276,
      "height": 126,
      "x": 631,
      "y": 0
    },
    {
      "fileName": "ln_easy4.png",
      "width": 268,
      "height": 100,
      "x": 907,
      "y": 0
    }
  ],
  "packMode": "horizontal",
  "padding": 0,
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "spriteSheetWidth": 1075,
  "spriteSheetHeight": 126
};

const mediumSpriteSheetData =  {
  "key": "medium",
"sprites": [
    {
      "fileName": "spr_classiccar_0.png",
      "width": 288,
      "height": 135,
      "x": 0,
      "y": 0
    },
    {
      "fileName": "spr_rally_0.png",
      "width": 288,
      "height": 135,
      "x": 288,
      "y": 0
    }
  ],
  "packMode": "horizontal",
  "padding": 0,
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "spriteSheetWidth": 576,
  "spriteSheetHeight": 135

}

const hardSpriteSheetData =  {
  "key": "hard",
"sprites": [
    {
      "fileName": "spr_car4_0.png",
      "width": 288,
      "height": 123,
      "x": 0,
      "y": 0
    }
  ],
  "packMode": "horizontal",
  "padding": 0,
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "spriteSheetWidth": 288,
  "spriteSheetHeight": 123

}

const fallingSpriteSheetData = {
  "key": "falling",
"sprites": [
    {
      "fileName": "spr_camper_0.png",
      "width": 288,
      "height": 144,
      "x": 0,
      "y": 0
    }
  ],
  "packMode": "horizontal",
  "padding": 0,
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "spriteSheetWidth": 288,
  "spriteSheetHeight": 144
}

const spriteSheetData = [bikesSpriteSheetData, easySpriteSheetData,mediumSpriteSheetData,hardSpriteSheetData,fallingSpriteSheetData ];

class Sprite {
      fileName;
      width;
      height;
      x;
      y;
      tileInfo;

  constructor(configuration) {
    const {fileName, width, height, x, y, index} = {...configuration};

    this.fileName = fileName;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.tileInfo = tile(vec2(x,y), vec2(width,height), index);
  }
}

class SpriteSheet {
  source;
  sprites;

  key;
  index;
  constructor(spriteData, key, source, index) {
    this.source = source;
    this.key = key;
    this.index = index;

    this.sprites = spriteData?.map((sprite) => {
      const spriteSettings = {...sprite};
      spriteSettings.index = index;

      return new Sprite(spriteSettings);
    });
  }
}



function isPaused() {
  return [_FOTL.states.paused, _FOTL.states.menu, _FOTL.states.intro].includes(
    _FOTL.currentState,
  );
}

const levelSize = vec2(38, 20); // size of play area

setCanvasFixedSize(vec2(1280, 720)); // use a 720p fixed size canvas
setCameraPos(levelSize.scale(0.5)); // center camera in level

let gameSprites;
let playerSprite;

function chooseSprite(key) {
    const keySprites = gameSprites.filter(x => x.key === key).shift();
    const spriteNdx = randInt(keySprites.sprites.length);
    const sprite = keySprites?.sprites[spriteNdx];

    return sprite.tileInfo;
}

  function gameReset(gameOver) {
  engineObjectsDestroy();

  _FOTL.player = new Player(levelSize,playerSprite);
  _FOTL.score = 0;
  _FOTL.currentState = _FOTL.states.running;
  _FOTL.currentlyPlaying = "";

    if (_FOTL.uiManager.visible)
      _FOTL.uiManager.toggleGameOver(false);
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
  }

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

  if (_FOTL.currentDifficulty == _FOTL.difficulties.easy){
    easyStart.unlock();
  } else if (_FOTL.currentDifficulty == _FOTL.difficulties.medium) {
    mediumStart.unlock();
  } else if (_FOTL.currentDifficulty == _FOTL.difficulties.hard) {
    hardStart.unlock();
  }

  if (_FOTL.score >= 10) {
   firstSteps.unlock();
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
