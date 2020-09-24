import {GameState} from "./gameState.js"

export function notify(message: string, displayTimeMs: number = 0) {
    document.getElementById("notification-text").innerHTML = message;
    if (displayTimeMs > 0) {
      setTimeout(clearNotifications, displayTimeMs);
    }
  }
  
export function clearNotifications() {
    document.getElementById("notification-text").innerHTML = "";
  }