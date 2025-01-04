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
    super(id??3, 'Start Me Up', 'Score 10 points on any difficulty', '🙌')
  }
}

class LeftLegDamageMedal extends Medal {
  constructor(id) {
    super(id??4, 'Put your left foot in', 'Scrape against the left (bottom) guardrail', '🩹')
  }
}

class RightLegDamageMedal extends Medal {
  constructor(id) {
    super(id??5, 'Right Foot, let\'s stomp', 'Scrape against the right (top) guardrail', '🩹')
  }
}

class LostHealthMedal extends Medal {
  constructor(id) {
    super(id??6, 'Just a scratch', 'Lose a health', '🤕')
  }
}

class LostSecondHealth extends Medal {
   constructor(id) {
     super(id??7, 'Leaving a dent', 'Lose the second health', '🩸')
   }
 } 

class LostAllHealth extends Medal {
  constructor(id) {
    super(id??8, 'See the other guy', 'Lose final health and spin out', '☠️')
  }
}

const easyStart = new EasyStartMedal(),
  mediumStart = new MediumStartMedal(),
  hardStart = new HardStartMedal();

const firstSteps = new FirstStepsMedal(),
  leftLegDamage = new LeftLegDamageMedal(),
  rightLegDamage = new RightLegDamageMedal();

const firstHealth = new LostHealthMedal(),
    secondHealth = new LostSecondHealth(),
    finalHealth = new LostAllHealth();
