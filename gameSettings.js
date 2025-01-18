
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
    runExts: () => {
      const names = Object.getOwnPropertyNames(extensions);

      names && names?.forEach(n => {
        debug && console.debug('Running ext: '+n);
        extensions[n]();
      })
    }
  };
})();
