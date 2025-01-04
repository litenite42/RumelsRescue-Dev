function NEXTPAGE(el) {
  el.addEventListener("click", (evt) => {
    let currentPage = el.parentNode.parentNode.querySelector(".is-visible");
    currentPage.classList.remove("is-visible");

    currentPage = currentPage.nextElementSibling;
    currentPage.classList.add("is-visible");
    if (currentPage.nextElementSibling.tagName !== 'P') {
      el.disabled = true;

      el.parentNode.querySelector('.start-game-container').classList.add('is-visible');
    }

    el.parentNode.querySelector(".last-page").disabled = false;
  });
}
function LASTPAGE(el) {
  el.addEventListener("click", (evt) => {
    let currentPage = el.parentNode.parentNode.querySelector(".is-visible");
    currentPage.classList.remove("is-visible");

    currentPage = currentPage.previousElementSibling;
    currentPage.classList.add("is-visible");

    if (!currentPage.previousElementSibling) {
      el.disabled = true;
    }

    el.parentNode.querySelector('.start-game-container').classList.remove('is-visible');
    el.parentNode.querySelector(".next-page").disabled = false;
  });
}
class uiManager {
  difficulty;
  mute;
  punishLazy;
  visible;

  menuContainer;
  menus;
  currentMenu;

  constructor() {
    this.menuContainer = document.querySelector('.menus');

    this.menus = this.menuContainer.querySelectorAll(".menus > div");
    this.currentMenu = Array.from(this.menus).filter(
      (m) => m.id == "main-menu",
    )[0];

    const startIntroBtn = this.currentMenu.querySelector("#main-menu-submit");

    startIntroBtn.addEventListener("click", (evt) => {
      const difficulty = document.querySelector('[name="difficulty"]:checked').value.toLowerCase();
      this.difficulty = _FOTL.difficulties[difficulty];

      const skipIntro = document.querySelector('[name="skipIntro"]:checked');
      const muteAudio = document.querySelector('[name="muteAudio"]:checked');
      const punishLazy = document.querySelector('[name="punishLazy"]:checked');

      this.skipIntro = !!skipIntro;
      this.mute = !!muteAudio;
      this.punishLazy = !!punishLazy;

      const playerName = document.querySelector('[name="playerName"]')?.value ?? 'Player1';
      _FOTL.player.name =playerName;
      medalsInit(playerName);
      this.currentMenu.classList.remove("is-visible");

      if (this.skipIntro) {
        _FOTL.currentState = _FOTL.states.running;
        this.menuContainer.classList.remove('is-visible')
      } 
      else {
      _FOTL.currentState = _FOTL.states.intro;

      this.currentMenu = Array.from(this.menus).filter(
        (m) => m.id == "intro-screen",
      )[0];
      this.currentMenu.classList.add("is-visible");
      }
    });

    Array.from(document.querySelectorAll(".next-page")).forEach(NEXTPAGE);
    Array.from(document.querySelectorAll(".last-page")).forEach(LASTPAGE);

    document.querySelector('#start-game').addEventListener('click', evt => {
      _FOTL.currentState = _FOTL.states.running;

      this.menuContainer.classList.remove('is-visible');
    })
  }

  togglePause() {
    this.toggleVisibility('pause-screen');
  }

  toggleGameOver(setGameState = true) {
    const gameOverScore = document.querySelector('#final-score'),
      gameOverReason = document.querySelector('#game-over-reason');

    gameOverScore.textContent = _FOTL.score;
    gameOverReason.textContent = _FOTL.gameOverReason;
    if (setGameState) {
      _FOTL.currentState = _FOTL.states.gameOver;
    }

    this.toggleVisibility('game-over-screen');
  }

  toggleVisibility(menuId) {
    Array.from(this.menus)/*.filter(m => m.id == menuId)*/.forEach(m => {
      if (m.id !== menuId) {
        m.classList.remove('is-visible');
        return;
      }

      if (m.classList.contains('is-visible')) {
        m.classList.remove('is-visible');
        this.menuContainer.classList.remove('is-visible');
        this.visible = false;
      } else {
        m.classList.add('is-visible');
        this.menuContainer.classList.add('is-visible');
        this.visible = true;
      }
    });
  }

  getVisibility() {
    return this.visible;
  }

  setVisibility(visible) {
    this.visible = visible;
  }
}
