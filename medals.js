class EasyStartMedal extends Medal {
  constructor(id) {
    super(id??0, 'Rumel\'s First Trike', 'Start the game on easy', '🍼');
  }
}

class MediumStartMedal extends Medal {
  constructor(id) {
    super(id??1, 'Rumel\'s First Bicycle', 'Start the game on medium', '🚲');
  }
}

class HardStartMedal extends Medal {
  constructor(id) {
    super(id??2, 'Rumel\'s First Hog', 'Start the game on hard', '🐖')
  }
}

class FirstStepsMedal extends Medal {
  constructor(id) {
    super(id??3, 'The Future Lies in The Distance', 'Score 10 points on any difficulty', '🙌')
  }
}

class LeftLegDamageMedal extends Medal {
  constructor(id) {
    super(id??4, 'Put your left foot in', 'Scrape against the left (bottom) guardrail', '🩹')
  }
}

const easyStart = new EasyStartMedal(),
  mediumStart = new MediumStartMedal(),
  hardStart = new HardStartMedal();

const firstSteps = new FirstStepsMedal(),
  leftLegDamage = new LeftLegDamageMedal();

