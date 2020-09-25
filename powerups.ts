import {GameState} from "./gameState.js"
import {annotatePowerUp, clearAnnotations} from "./annotation.js"

export function activatePowerUp(gameState: GameState, powerupClass: string) {
    if (powerupClass.includes("color")) {
      gameState.colorChangeActive = true;
      annotatePowerUp("color", gameState.colorChangesUsed, false);
    } else if (powerupClass.includes("guard")) {
      gameState.guardActive = true;
      annotatePowerUp("guard", gameState.guardsUsed, false);
    } else if (powerupClass.includes("dupe")) {
      gameState.dupeActive = true;
      annotatePowerUp("dupe", gameState.dupesUsed, false);
    }
};
  
export function deactivatePowerUp(gameState: GameState, powerupClass: string) {
    if (powerupClass.includes("color")) {
      gameState.colorChangeActive = false;
      clearAnnotations("potential-color-powerup-annotation");
    } else if (powerupClass.includes("guard")) {
      gameState.guardActive = false;
      clearAnnotations("potential-guard-powerup-annotation");
    } else if (powerupClass.includes("dupe")) {
      gameState.dupeActive = false;
      clearAnnotations("potential-dupe-powerup-annotation");
    }
};

export function togglePowerUp(gameState: GameState, powerupClass: string) {
    if (powerupClass.includes("color")) {
      if (gameState.colorChangeActive) {
        deactivatePowerUp(gameState, powerupClass);
      } else {
        activatePowerUp(gameState, powerupClass);
      }
    } else if (powerupClass.includes("guard")) {
      if (gameState.guardActive) {
        deactivatePowerUp(gameState, powerupClass);
      } else {
        activatePowerUp(gameState, powerupClass);
      }
    } else if (powerupClass.includes("dupe")) {
      if (gameState.dupeActive) {
        deactivatePowerUp(gameState, powerupClass);
      } else {
        activatePowerUp(gameState, powerupClass);
      }
    }
};

export function revertPowerups(gameState: GameState) {
    if (gameState.colorChangeActive) {
        clearAnnotations("potential-color-powerup-annotation");
        gameState.colorChangeActive = false;
    }
    if (gameState.guardActive) {
        clearAnnotations("potential-guard-powerup-annotation");
        gameState.guardActive = false;
    }
    if (gameState.dupeActive) {
        clearAnnotations("potential-dupe-powerup-annotation");
        gameState.dupeActive = false;
    }
}

export function confirmPowerups(gameState: GameState) {
    if (gameState.colorChangeActive) {
        clearAnnotations("potential-color-powerup-annotation");
        annotatePowerUp("color", gameState.colorChangesUsed, true);
        gameState.colorChangesUsed += 1;
        gameState.colorChangeActive = false;
    }
    if (gameState.guardActive) {
        clearAnnotations("potential-guard-powerup-annotation");
        annotatePowerUp("guard", gameState.guardsUsed, true);
        gameState.guardsUsed += 1;
        gameState.guardActive = false;
    }
    if (gameState.dupeActive) {
        clearAnnotations("potential-dupe-powerup-annotation");
        annotatePowerUp("dupe", gameState.dupesUsed, true);
        gameState.dupesUsed += 1;
        gameState.dupeActive = false;
    }
}