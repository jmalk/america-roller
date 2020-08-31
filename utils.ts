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