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

function changeDieBackground(leftOrRight, highlightColor="#A3A3A3") {
  let divId = leftOrRight === "left" ? "die1-div" : "die2-div";
  document.getElementById(divId).style.backgroundColor = highlightColor;
}

let dieSelection = null;
let activeDie = null;

function activateDie(leftOrRight: string, targetDie: Dice) {
  if (dieSelection !== null) {
    changeDieBackground(dieSelection);
  }
  dieSelection = leftOrRight;
  activeDie = targetDie;
  changeDieBackground(dieSelection, "red");
}

function deactivateDie(targetColor: string = "#A3A3A3") {
  if (dieSelection !== null) {
    changeDieBackground(dieSelection, targetColor);
  }
  dieSelection = null;
  activeDie = null;
}
// function toggleDieSelection(leftOrRight: String, targetDie: Dice) {
//   if (dieSelection === null) {
//     dieSelection = leftOrRight;
//     activeDie = targetDie;
//     highlightDie(leftOrRight);
//   } else if (dieSelection !== leftOrRight) {
//     unhighlightDie(dieSelection);
//     dieSelection = leftOrRight;
//     activeDie = targetDie;
//     highlightDie(leftOrRight);
//   } else {
//     dieSelection = null;
//     activeDie = null;
//     unhighlightDie(leftOrRight);
//   }
// }

function showDie(parentDivId, die: Dice) {
  let dieImg = document.createElement("img");
  dieImg.id = parentDivId.substring(0,4);
  dieImg.className = "die-image";
  dieImg.src = "assets/dice/" + die.color + "-" + die.number.toString() + ".png";
  let leftOrRight = parentDivId === "die1-div" ? "left" : "right"
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
    changeDieBackground("left");
    changeDieBackground("right");
    
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
      document.getElementById("round-tracker").innerHTML = "ROUND: ";
      document.getElementById("roll-tracker").innerHTML = "ROLL: ";
  
      clearDie("die1-div");
      clearDie("die2-div");
    } else {
      document.getElementById("round-tracker").innerHTML = "ROUND: " + this.round.toString();
      document.getElementById("roll-tracker").innerHTML = "ROLL: " + this.turn.toString();
  
      showDie("die1-div", this.currentDice()[0]);
      showDie("die2-div", this.currentDice()[1]);
    }
  
    if (this.isGameOver()) {
      document.getElementById("game-over").innerHTML = "GAME OVER";
    }
  }
}

let gameState = new GameState();
document.body.addEventListener('click', function() {
  var target = event.target as HTMLElement; 
  if (dieSelection === null && target.className === "die-image") {
    // no currently active die so activate one just selected
    var leftOrRight = target.id === "die1" ? "left" : "right";
    var targetDie = leftOrRight === "left" ? gameState.currentDice()[0] : gameState.currentDice()[1];
    activateDie(leftOrRight, targetDie);
  } else if (dieSelection !== null && target.className === "die-image") {
    // there is a currently active die but a die has been clicked
    var targetLeftOrRight = target.id === "die1" ? "left" : "right";
    if (targetLeftOrRight === dieSelection) {
      // if it's the same one that's currently active then deactivate it
      deactivateDie();
    } else {
      // if it's the other one then switch which die is active
      deactivateDie();
      var targetDie = leftOrRight === "left" ? gameState.currentDice()[0] : gameState.currentDice()[1];
      activateDie(targetLeftOrRight, targetDie);
    }
  } else if (dieSelection !== null && target.className === "state-area") {
    // assign die to state
    chooseState(activeDie, target);
    deactivateDie("green");
  } else if (dieSelection !== null && target.className === "helper-area") {
    // activate helper
    console.log("Helper activated");
    deactivateDie();
  } else {
    deactivateDie();
  }
}, true); 

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

function chooseState(activeDie: Dice, targetState: HTMLElement) {
  console.log("Putting a " + activeDie.color.toString() + " " + activeDie.number.toString() + " in " + targetState.title.toString());
}
