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

function showDie(parentDivId, die: Dice) {
  let dieImg = document.createElement("img");
  dieImg.className = "die-image";
  dieImg.src = "assets/dice/" + die.color + "-" + die.number.toString() + ".png";
  let parentDiv = document.getElementById(parentDivId)
  if (parentDiv.hasChildNodes()) {
    parentDiv.replaceChild(dieImg, parentDiv.firstChild);
  } else {
    parentDiv.appendChild(dieImg);
  }
}

function render(round: number, turn: number, firstDie: Dice, secondDie: Dice) {
  document.getElementById("game-over").innerHTML = "";

  document.getElementById("round-tracker-value").innerHTML = round.toString();
  document.getElementById("roll-tracker-value").innerHTML = turn.toString();

  showDie("die1-div", firstDie);
  showDie("die2-div", secondDie);

  if (round == 8 && turn == 3) {
    document.getElementById("game-over").innerHTML = "GAME OVER";
  }
}

function roll() {
  // do something that gets you an updated round, turn, firstdie and seconddie
  // pass those to render()

  function randomInRange(lowerBound, upperBound) {
    return lowerBound + Math.round(Math.random() * (upperBound - lowerBound));
  }

  const colors: DiceColor[] = ["red", "orange", "yellow", "green", "blue", "purple", "colorless"];
  let randomRound = randomInRange(1,8);
  let randomThrow = randomInRange(1,3);
  let randThrow = Math.ceil(Math.random() * 3);
  let firstDie: Dice = {
    number: randomInRange(1,6),
    color: colors[randomInRange(0, colors.length - 1)]
  };
  let secondDie: Dice = {
    number: randomInRange(1,6),
    color: colors[randomInRange(0, colors.length - 1)]
  };
  render(randomRound, randomThrow, firstDie, secondDie);

}