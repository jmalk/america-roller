export function strikeRound(roundNumber: number) {
    let allAreas = [].slice.call(document.querySelectorAll('.round-area'));
    let targetArea = allAreas.find(a => a.title == "round" + roundNumber.toString());
    let centroid = getCentroid(targetArea.coords, targetArea.shape);

    let newTextDiv = document.createElement("div");
    newTextDiv.innerHTML = "X";
    newTextDiv.className = "annotation";
    newTextDiv.style.position = "absolute";
    newTextDiv.style.fontSize = "24pt";

    let verticalPosition = Math.round(centroid.y) - 20;
    newTextDiv.style.top = verticalPosition.toString() + "px";
    
    let horizontalPosition = Math.round(centroid.x) - 13;
    newTextDiv.style.left = horizontalPosition.toString() + "px";
    document.getElementById("map").appendChild(newTextDiv);
}

export function annotatePowerUp(powerupType: string, numUsed: number, confirmed: boolean) {
    let targetTitle = powerupType + (numUsed+1).toString();
    let targetAreaSelector = "." + powerupType + "-helper-area"

    let allAreas = [].slice.call(document.querySelectorAll(targetAreaSelector));
    let targetArea = allAreas.find(a => a.title == targetTitle);
    let centroid = getCentroid(targetArea.coords, targetArea.shape);

    let newTextDiv = document.createElement("div");
    newTextDiv.innerHTML = "X";
    newTextDiv.style.position = "absolute";
    newTextDiv.style.fontSize = "18pt";
    if (confirmed) {
        newTextDiv.className = "confirmed-" + powerupType + "-powerup-annotation";
        newTextDiv.style.color = "black";
    } else {
        newTextDiv.className = "potential-" + powerupType + "-powerup-annotation";
        newTextDiv.style.color = "#D1D1D1";
    }

    let verticalPosition = Math.round(centroid.y) - 17;
    newTextDiv.style.top = verticalPosition.toString() + "px";
    
    let horizontalPosition = Math.round(centroid.x) - 10;
    newTextDiv.style.left = horizontalPosition.toString() + "px";
    document.getElementById("map").appendChild(newTextDiv);
}

export function annotateXCount(newValue: string) {
    clearAnnotations("xcount-annotation");

    let allAreas = [].slice.call(document.querySelectorAll('.xcount-area'));
    let targetArea = allAreas.find(a => a.title == "numXs");
    let centroid = getCentroid(targetArea.coords, targetArea.shape);

    let newTextDiv = document.createElement("div");
    newTextDiv.innerHTML = newValue;
    newTextDiv.className = "xcount-annotation";
    newTextDiv.style.fontSize = "48pt";
    newTextDiv.style.position = "absolute";

    let verticalPosition = Math.round(centroid.y) - 8;
    newTextDiv.style.top = verticalPosition.toString() + "px";
    
    let horizontalPosition = Math.round(centroid.x) - 5;
    newTextDiv.style.left = horizontalPosition.toString() + "px";
    document.getElementById("map").appendChild(newTextDiv);
}

export function annotateState(targetState: string, value: string, guarded: boolean = false) {
    let allAreas = [].slice.call(document.querySelectorAll('.state-area'));
    let targetArea = allAreas.find(a => a.title == targetState);

    let centroid = getCentroid(targetArea.coords, targetArea.shape);

    let newTextDiv = document.createElement("div");
    newTextDiv.innerHTML = value;
    newTextDiv.className = "annotation";
    newTextDiv.style.position = "absolute";
    if (guarded) {
        newTextDiv.style.color = "red";
    }

    let verticalPosition = Math.round(centroid.y) - 8;
    newTextDiv.style.top = verticalPosition.toString() + "px";
    
    let horizontalPosition = Math.round(centroid.x) - 5;
    newTextDiv.style.left = horizontalPosition.toString() + "px";
    document.getElementById("map").appendChild(newTextDiv);
}

export function getCentroid(coords: string, shapeType: string) {
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
  
export function get_polygon_centroid(pts) {
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

export function clearAnnotations(annotationType: string = "annotation") {
    let allChildren = Array.from(document.getElementById("map").children);
    allChildren.forEach(function(child) {
      if (child.className == annotationType) {
        document.getElementById("map").removeChild(child);
      }
    });
  }