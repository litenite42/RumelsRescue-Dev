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
     super(id??7, 'Leaving a dent', 'Lose another health', '🩸')
   }
 } 

class LostAllHealth extends Medal {
  constructor(id) {
    super(id??8, 'See the other guy', 'Lose final health and spin out', '☠️')
  }
}

class SecondPointsMedal extends Medal {
  constructor(id) {
    super(id??9, 'Making your way downtown', 'Score 25 points on any difficulty', '🙌')
  }
}

class FiftyPointsMedal extends Medal {
  constructor(id) {
    super(id??12, 'Livin\' On A Prayer', 'Score 50 points on any difficulty', '🙌')
  }
}

class SeventyFivePointsMedal extends Medal {
  constructor(id) {
    super(id??11, 'Going thru H3🏒🏒', 'Score 75 points on any difficulty', '🔥')
  }
}

class HundredPointsMedal extends Medal {
  constructor(id) {
    super(id??10, '100 in a 55', 'Score 100 points on any difficulty', '🙌')
  }
}

const easyStart = new EasyStartMedal(),
  mediumStart = new MediumStartMedal(),
  hardStart = new HardStartMedal();

const firstSteps = new FirstStepsMedal(),
  twentyFivePoints = new SecondPointsMedal(),
  fiftyPoints = new FiftyPointsMedal(),
  seventyFivePoints = new SeventyFivePointsMedal(),
  hundredPoints = new HundredPointsMedal(),
  leftLegDamage = new LeftLegDamageMedal(),
  rightLegDamage = new RightLegDamageMedal();

const firstHealth = new LostHealthMedal(),
    secondHealth = new LostSecondHealth(),
    finalHealth = new LostAllHealth();
