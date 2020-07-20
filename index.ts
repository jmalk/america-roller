const NUM_ROUNDS = 8;
const NUM_TURNS = 3;

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

function generateGameDice() {
  let dice = [];
  for (var i = 0; i < NUM_ROUNDS; i++) {
    dice.push(generateRound());
  }
  return dice;
}

function clearDie(parentDivId) {
  let parent = document.getElementById(parentDivId);
  let oldChild = parent.childNodes[0];
  parent.removeChild(oldChild);
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

class GameState {
  round = 1;
  turn = 0;
  diceRolls = generateGameDice();

  isNewGame() {
    return this.round === 1 && this.turn === 0;
  }

  isGameOver() {
    return this.round === NUM_ROUNDS && this.turn === NUM_TURNS;
  } 

  currentDice() {
    let roundDice = this.diceRolls[this.round - 1];
    return roundDice.slice(this.turn*2 - 2, this.turn*2);
  }

  newTurn() {
    this.turn += 1;

    // Three turns per round
    if (this.turn === NUM_TURNS + 1) {
      this.turn = 1;
      this.round += 1;
    }

    this.render();
  }

  render() {
    document.getElementById("game-over").innerHTML = "";
  
    if (this.isNewGame()) {
      document.getElementById("round-tracker-value").innerHTML = "";
      document.getElementById("roll-tracker-value").innerHTML = "";
  
      clearDie("die1-div");
      clearDie("die2-div");
    } else {
      document.getElementById("round-tracker-value").innerHTML = this.round.toString();
      document.getElementById("roll-tracker-value").innerHTML = this.turn.toString();
  
      showDie("die1-div", this.currentDice()[0]);
      showDie("die2-div", this.currentDice()[1]);
    }
  
    if (this.isGameOver()) {
      document.getElementById("game-over").innerHTML = "GAME OVER";
    }
  }
}

let gameState = new GameState();

function roll() {
  if (gameState.isGameOver()) {
    reset();
  }
  gameState.newTurn();
}

function reset() {
  gameState = new GameState();
  gameState.render();
}
