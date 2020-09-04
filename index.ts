import {Dice, DiceColor} from "./dice.js"
import {validateNewValue, submitStateValue} from "./rules.js"
import {strikeRound} from "./annotation.js"

const NUM_ROUNDS = 8;
const NUM_TURNS = 3;

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

  const diceForRound = colorOrder.map((color, diceIndex) => {
    return new Dice(color, diceIndex);
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

let activeDie = null;

function activateDie(leftOrRight: string) {
  if (activeDie !== null) {
    activeDie.setBackground();
  }
  activeDie = gameState.currentDice()[leftOrRight];
  activeDie.setBackground("red");
}

function deactivateDie(targetColor="#A3A3A3") {
  if (activeDie !== null) {
    activeDie.setBackground(targetColor);
  }
  activeDie = null;
}

function updateRollButton(canRoll: boolean) {
  let canRollColor = "red";
  let noRollColor = "rosybrown";
  if (canRoll) {
    document.getElementById("roll-button").style.backgroundColor = canRollColor;
  } else {
    document.getElementById("roll-button").style.backgroundColor = noRollColor;
  }

}

class GameState {
  round = 1;
  turn = 0;
  diceRolls = generateGameDice();
  devMode: boolean = false;

  isNewGame() {
    return this.round === 1 && this.turn === 0;
  }

  isGameOver() {
    return this.round === NUM_ROUNDS && this.turn === NUM_TURNS;
  } 

  currentDice() {
    let roundDice = this.diceRolls[this.round - 1];
    return {
      "left": roundDice[this.turn*2 - 2],
      "right": roundDice[this.turn*2 - 1]
    };
  }

  canRoll() {
    return gameState.devMode || gameState.isNewGame() || 
      (gameState.currentDice().left.assigned && gameState.currentDice().right.assigned);
  }

  newTurn() {
    this.turn += 1;

    // Three turns per round
    if (this.turn === NUM_TURNS + 1) {
      strikeRound(this.round);
      this.turn = 1;
      this.round += 1;
    }

    this.render();
  }

  render() {
    clearNotifications();
  
    if (this.isNewGame()) {
      document.getElementById("round-tracker").innerHTML = "ROUND: ";
      document.getElementById("roll-tracker").innerHTML = "ROLL: ";

    } else {
      document.getElementById("round-tracker").innerHTML = "ROUND: " + this.round.toString();
      document.getElementById("roll-tracker").innerHTML = "ROLL: " + this.turn.toString();
  
      this.currentDice().left.render();
      this.currentDice().right.render();
    }
  
    if (this.isGameOver()) {
      notify("GAME OVER");
    }
  }
}

let gameState = new GameState();
document.body.addEventListener('click', function() {
  var target = event.target as HTMLElement; 
  if (activeDie === null && target.className === "die-image") {
    // no currently active die so activate one just selected
    var leftOrRight = target.id === "die-left" ? "left" : "right";
    activateDie(leftOrRight);
  } else if (activeDie !== null && target.className === "die-image") {
    // there is a currently active die but a die has been clicked
    var targetLeftOrRight = target.id === "die-left" ? "left" : "right";
    if (targetLeftOrRight === activeDie.position) {
      // if it's the same one that's currently active then deactivate it
      deactivateDie();
    } else {
      // if it's the other one then switch which die is active
      deactivateDie();
      activateDie(targetLeftOrRight);
    }
  } else if (activeDie !== null && target.className === "state-area") {
    // assign die to state
    let successfulChoice = submitStateValue(target.title.toString(), activeDie);
    if (successfulChoice) {
      activeDie.drawOnMap(target.title);
      deactivateDie("green");
      updateRollButton(gameState.canRoll());
    } else {
      notify("INVALID", 1000);
    }
  } else if (activeDie !== null && target.className === "helper-area") {
    // activate helper
    console.log("Helper activated");
    deactivateDie();
  } else {
    deactivateDie();
  }
}, true); 

document.getElementById('roll-button').addEventListener('click', function() {roll();});
document.getElementById('reset-button').addEventListener('click', function() {reset();});

export function roll() {
  if (gameState.isGameOver()) {
    reset();
  }
  if (gameState.canRoll()) {
    gameState.newTurn();
  }
  updateRollButton(gameState.canRoll());
}

export function reset() {
  gameState.currentDice().left.clear();
  gameState.currentDice().right.clear();
  clearAnnotations();

  gameState = new GameState();
  gameState.render();
}

function notify(message: string, displayTimeMs: number = 0) {
  document.getElementById("notification-text").innerHTML = message;
  if (displayTimeMs > 0) {
    setTimeout(clearNotifications, displayTimeMs);
  }
}

function clearNotifications() {
  document.getElementById("notification-text").innerHTML = "";
}

function clearAnnotations() {
  let allChildren = Array.from(document.getElementById("map").children);
  allChildren.forEach(function(child) {
    if (child.className == "annotation") {
      document.getElementById("map").removeChild(child);
    }
  });
}