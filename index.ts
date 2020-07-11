type DiceColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "colorless";

type Dice = { number: number; color: DiceColor };

type DiceBag = Dice[];

function dice(color: DiceColor, number: number): Dice {
  return {
    color,
    number,
  };
}

function diceBag(): DiceBag {
  // Could write a helper function to put the dice in the bag in a random order?
  const bag = [
    dice("red", 6),
    dice("orange", 6),
    dice("yellow", 6),
    dice("green", 6),
    dice("blue", 6),
    dice("purple", 6),
    dice("colorless", 6),
  ];
  return bag;
}

// TODO How to make number => DiceNumber in types?
function rollDie(): number {
  const number = Math.random() * 6;
  const result = Math.ceil(number);
  return result;
}

function generateRound(): DiceBag {
  // One dice of each color
  const bag = diceBag();

  // Randomise the order of the colors
  // TODO: The important bit!!!

  // Randomise the numbers on all the dice
  const rolledBag = bag.map(({ color }) => {
    return {
      color,
      number: rollDie(),
    };
  });
  return rolledBag;
}

function generateGame() {
  // TODO Don't need the last dice of each round really.
  return [
    generateRound(),
    generateRound(),
    generateRound(),
    generateRound(),
    generateRound(),
    generateRound(),
    generateRound(),
    generateRound(),
  ];
}

document.body.innerHTML = "" + JSON.stringify(generateGame(), null, 2);
console.log(generateGame());
