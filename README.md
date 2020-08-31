# America Roller

Dice roller for the tabletop game "Rolling America"

Install dependencies with `npm ci`.

Make a one-off build of the JavaScript with `npm run build`.

For development:
* tab 1: do `npm run watch` to keep updating the JavaScript every time you save the TypeScript.
* tab 2: do `http-server -c-1` to launch a HTTP server of the project with caching disabled

#### TODO
* place an x if no valid choice
* guard, color dupe etc
* grey out roll button unless you can roll
* calculate total X's at end of game