const spriteSheets = {
  base: 'assets/images/',
  names: ['player', 'easy', 'medium', 'hard', 'falling',  'pothole1', 'healthpickup' ],
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
let numberHealthsAvailable;
let numberPotHoles;

function chooseSprite(key) {
    const keySprites = gameSprites.filter(x => x.key === key).shift();
    const spriteNdx = randInt(keySprites.sprites.length);
    const sprite = keySprites?.sprites[spriteNdx];

    return sprite.tileInfo;
}

const _FOTL = (() => {
  const palette = {
    red: new Color().setHex("#ff0000"),
    green: new Color().setHex("#009342"),
    white: new Color().setHex("#ffffff"),
  };

  const extensions = {};

  const _addExt = (key, callback, init = 0) => {
    init && init();
    key && extensions && (extensions[key] = callback);
  }

  const _getExt = (key) => {
    return key && extensions && extensions[key];
  }

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

  const _resetExts = () => {
      const names = Object.getOwnPropertyNames(extensions);

      names && names.forEach(n => {
        debug && console.debug('Clearing ext: '+n);
        const extension = _FOTL[n];
         extension && extension.reset && extension.reset();
      });
    };

  const _runExts = () => {
      const names = Object.getOwnPropertyNames(extensions);

      names && names?.forEach(n => {
        debug && console.debug('Running ext: '+n);
        extensions[n]();
      })
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
    music: music,
    addExt: _addExt,
    getExt: _getExt,
    resetExts: _resetExts,
    runExts:_runExts
  };
})();
