// Create a Paper.js Path to draw a line into it:
tool.minDistance = 10;
tool.maxDistance = 45;

var raster = new Raster("creme.png");
raster.position = view.center;
raster.scale(0.1);

var path;
var empty = true;

// function onMouseEnter(event) {
// 	console.log("entered")
// 	check = true;
// 	path = new Path();
// 	path.fillColor = "white"
// 	path.add(event.point);
// }

function onMouseMove(event) {
  console.log("move");

  if (empty == true) {
    console.log("entered");
    check = true;
    path = new Path();
    path.fillColor = "white";
    path.add(event.point);
    empty = false;
  } else if (empty == false) {
    var step = event.delta / 2;
    step.angle += 90;
    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    path.add(top);
    path.insert(0, bottom);
    path.smooth();
  }
}

function onMouseLeave(event) {
  console.log("bye");
  path.add(event.point);
  path.closed = true;
  path.smooth();
  empty = true;
}

var rect = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width, view.size.height],
  strokeColor: "white",
  selected: true
});
rect.sendToBack();
rect.fillColor = "#FFF9EE";
