
class LaneSelector {
  #quads;
  #lastLane;

  constructor(obj) {
    let { quads } = {...obj};


    if (!quads || !quads.length) {
      quads = [4, 9, 14, 19];
    }
   
    this.#quads = quads;
    this.#lastLane = -100;
  }

  New() {
    let randNdx = randInt(4);
    let selectedQuad = this.#quads[randNdx];

    while (selectedQuad === this.#lastLane) {
      randNdx = randInt(4);
      selectedQuad = this.#quads[randNdx];
    }

    this.#lastLane = selectedQuad;
    return selectedQuad;
  }
}
