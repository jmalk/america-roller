import {strikeRound, annotateXCount} from "./annotation.js"
import {Dice, DiceColor} from "./dice.js"
import {notify, clearNotifications} from "./notifications.js"

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
  
    let xActive = false;
  
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
  
  function generateGameDice(num_rounds) {
    let dice = [];
    for (var i = 0; i < num_rounds; i++) {
      dice.push(generateRound());
    }
    return dice;
  }

export class GameState {
    // will get set by constructor
    roundsPerGame = null;
    rollsPerRound = null;
    diceRolls = null;

    round = 1;
    turn = 0;
    
    devMode: boolean = false;
    xActive = false;
    numXUsed = 0;

    constructor(roundsPerGame, rollsPerRound) {
        this.roundsPerGame = roundsPerGame;
        this.rollsPerRound = rollsPerRound;
        this.diceRolls = generateGameDice(this.roundsPerGame);
      }
  
    incrementX() {
      this.numXUsed += 1;
      annotateXCount(this.numXUsed.toString());
    }
  
    isNewGame() {
      return this.round === 1 && this.turn === 0;
    }
  
    isGameOver() {
      return this.round === this.roundsPerGame && this.turn === this.rollsPerRound;
    } 
  
    currentDice() {
      let roundDice = this.diceRolls[this.round - 1];
      return {
        "left": roundDice[this.turn*2 - 2],
        "right": roundDice[this.turn*2 - 1]
      };
    }
  
    canRoll() {
      return this.devMode || this.isNewGame() || 
        (this.currentDice().left.assigned && this.currentDice().right.assigned);
    }
  
    newTurn() {
      this.turn += 1;
  
      // Three turns per round
      if (this.turn === this.rollsPerRound + 1) {
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