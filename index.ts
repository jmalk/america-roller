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

let gameState = {
  currentRound: 1,
  currentTurn: 0,
  diceRolls: generateGame(),
};

function newTurn() {
  gameState.currentTurn += 1;

  // Three turns per round
  if (gameState.currentTurn === 4) {
    gameState.currentTurn = 1;
    gameState.currentRound += 1;
  }

  // `currentRound - 1` because the array of rounds is zero-indexed but we
  // want the round number to be sensible to humans.
  const diceForRound = gameState.diceRolls[gameState.currentRound - 1];
  const diceForTurn =
    gameState.currentTurn === 1
      ? [diceForRound[0], diceForRound[1]]
      : gameState.currentTurn === 2
      ? [diceForRound[2], diceForRound[3]]
      : gameState.currentTurn === 3
      ? [diceForRound[4], diceForRound[5]]
      : null;

  if (diceForTurn.length === 2) {
    render(
      gameState.currentRound,
      gameState.currentTurn,
      diceForTurn[0],
      diceForTurn[1]
    );
  } else {
    throw new Error(
      `Did not find two dice for this turn. Round ${gameState.currentRound}, Turn ${gameState.currentTurn}, diceForTurn ${diceForTurn}`
    );
  }
}

function showDie(parentDivId, die: Dice) {
  let dieImg = document.createElement("img");
  dieImg.className = "die-image";
  dieImg.src =
    "assets/dice/" + die.color + "-" + die.number.toString() + ".png";
  let parentDiv = document.getElementById(parentDivId);
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
  newTurn();
}

function reset() {
  console.log("reset the game state");
}
