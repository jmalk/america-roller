# America Roller

Dice roller for the tabletop game "Rolling America"

Install dependencies with `npm ci`.

Make a one-off build of the JavaScript with `npm run build`.

For development:
* tab 1: do `npm run watch` to keep updating the JavaScript every time you save the TypeScript.
* tab 2: do `http-server -c-1` to launch a HTTP server of the project with caching disabled

#### TODO
* present points total at the end of the game
* color change - if active, the current active die is colorless for the purposes of placement
* guard - if active, the next chosen placement doesn't have to obey neighbour rules now or in the future
* dupe - if active, the user can place the current active die twice
