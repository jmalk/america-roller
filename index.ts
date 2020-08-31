import {Dice, DiceColor} from "./dice.js"
import {validateNewValue, submitStateValue} from "./rules.js"

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
    return {
      "left": roundDice[this.turn*2 - 2],
      "right": roundDice[this.turn*2 - 1]
    };
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
      document.getElementById("round-tracker").innerHTML = "ROUND: ";
      document.getElementById("roll-tracker").innerHTML = "ROLL: ";

    } else {
      document.getElementById("round-tracker").innerHTML = "ROUND: " + this.round.toString();
      document.getElementById("roll-tracker").innerHTML = "ROLL: " + this.turn.toString();
  
      this.currentDice().left.render();
      this.currentDice().right.render();
    }
  
    if (this.isGameOver()) {
      document.getElementById("game-over").innerHTML = "GAME OVER";
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
    let successfulChoice = submitStateValue(target.title.toString(), activeDie.number, true);
    if (successfulChoice) {
      drawNumber(target.title.toString(), activeDie.number);
      deactivateDie("green");
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
  gameState.newTurn();
}

export function reset() {
  gameState.currentDice().left.clear();
  gameState.currentDice().right.clear();

  gameState = new GameState();
  gameState.render();
}

function drawNumber(state: string, newNumber: number) {
  // get options
  let allAreas = [].slice.call(document.querySelectorAll('.state-area'));
  let targetArea = allAreas.find(a => a.title == state);

  let centroid = getCentroid(targetArea.coords, targetArea.shape);

  let newTextDiv = document.createElement("div");
  newTextDiv.innerHTML = newNumber.toString();
  newTextDiv.style.position = "absolute";

  let verticalPosition = Math.round(centroid.y) - 5;
  newTextDiv.style.top = verticalPosition.toString() + "px";
  
  let horizontalPosition = Math.round(centroid.x) - 5;
  newTextDiv.style.left = horizontalPosition.toString() + "px";
  document.getElementById("map").appendChild(newTextDiv);
}

function getCentroid(coords: string, shapeType: string) {
  let parts = coords.split(",").map(x => Number.parseInt(x));
  let pts = [];
  for (var i = 0; i < parts.length; i++) {
    if (i%2 == 0) {
      pts.push({
        x: parts[i],
        y: parts[i+1]
      });
    }
  }
  if (shapeType == "rect") {
    return {
      x: (pts[0].x + pts[1].x)/2.0,
      y: (pts[0].y + pts[1].y)/2.0,
    }
  } else {
    return get_polygon_centroid(pts);
  }
}

function get_polygon_centroid(pts) {
  var first = pts[0], last = pts[pts.length-1];
  if (first.x != last.x || first.y != last.y) pts.push(first);
  var twicearea=0,
  x=0, y=0,
  nPts = pts.length,
  p1, p2, f;
  for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
     p1 = pts[i]; p2 = pts[j];
     f = p1.x*p2.y - p2.x*p1.y;
     twicearea += f;          
     x += ( p1.x + p2.x ) * f;
     y += ( p1.y + p2.y ) * f;
  }
  f = twicearea * 3;
  return { x:x/f, y:y/f };
}