type DiceColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "colorless";

type Dice = { number: number; color: DiceColor };

// TODO How to make number => DiceNumber in types?
function rollDie(sides = 6): number {
  return Math.ceil(Math.random() * sides);
}

function randomIndex(arrayLength) {
  return Math.floor(Math.random() * arrayLength);
}

function generateRound(): Dice[] {
  let allColors: DiceColor[] = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "colorless",
  ];

  let totalColors = allColors.length;

  let colorOrder = [];

  // Use `totalColors - 1` because one die is always left in the bag
  for (let i = 0; i < totalColors - 1; i++) {
    const random = randomIndex(allColors.length);
    const picked = allColors.splice(random, 1);
    colorOrder = colorOrder.concat(picked);
  }

  const diceForRound = colorOrder.map((color) => {
    return {
      color,
      number: rollDie(),
    };
  });

  return diceForRound;
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

function reset() {
  console.log("reset the game state");
}
