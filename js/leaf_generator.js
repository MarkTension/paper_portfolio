$(document).ready(function() {
  paper.setup("myCanvas");
  with (paper) {
    // create all constants
    const inner_color = ["white", "white", "white", "white"];
    const outer_color = ["Moccasin", "LightCyan", "Honeydew", "pink"].sort(
      function() {
        return 0.5 - Math.random();
      }
    );
    const n_leaves = 4;
    const n_leaf_nodes = 20;
    const height = 0.02; // max height of wave
    const leaf_size = 18;
    const line_diag = 4; // how many y does each segment traverse downward?
    let direction_base = 5; // direction of leaf line branch

    // make original base-polygon function
    var base = new Path.RegularPolygon(
      new Point(paper.view.bounds.width / 2, paper.view.bounds.height / 2),
      n_leaves,
      paper.view.bounds.width / 8
    );

    // base2 = base.clone();
    // base2.fillColor = "papayaWhip ";
    // base3 = base2.clone();
    // base3.scale(0.4, 0.4);
    // base3.fillColor = "white ";

    console.log("width is  " + paper.view.bounds.width);
    base.segments[0].point.x -= Math.random() * 50;
    base.segments[0].point.y += Math.random() * 50;
    base.segments[1].point.x -= Math.random() * 50;
    base.segments[1].point.y -= Math.random() * 50;
    base.segments[2].point.x -= Math.random() * 50;
    base.segments[2].point.y -= Math.random() * 50;
    base.segments[3].point.x += Math.random() * 50;
    base.segments[3].point.y += Math.random() * 50;

    // base.segments[1].point.x -= (Math.random() - 0.5) * 100;
    // base.segments[0].point.x += (Math.random() - 0.5) * 100;
    // base.segments[2].point.y += (Math.random() - 0.5) * 100 - 100;
    // base.segments[0].point.y += (Math.random() - 0.5) * 100 - 100;

    // predefine leaf arrays here
    var leaves = new Array(n_leaves).fill(0);
    const half = Math.round(n_leaf_nodes / 2);

    ////// helper function come here ///////
    // function for rotations
    function rotate_straight(object) {
      // ydif / xdif
      const slope =
        math.abs(object.segments[half].point.y - object.segments[0].point.y) /
        math.abs(object.segments[half].point.x - object.segments[0].point.x);

      // if I know the slope, I know how much to turn
      // 90 degrees - arctangent(slope)
      const angle = 90 - math.multiply(math.atan(slope), 180 / math.pi);
      console.log("angle is " + angle);
      object.rotate(-angle);
      return angle;
    }
    ////// helper function end here ///////

    // call leaf function base many times
    for (i = 0; i < n_leaves; i++) {
      // Create a decagon shaped path for each leaf
      var decagon = new Path.RegularPolygon(
        new Point(base.segments[i].point.x, base.segments[i].point.y),
        n_leaf_nodes,
        leaf_size
      ); // only do even numbers!
      // decagon.translate(400, 100);

      // make empty first leaf
      leaves[i] = {
        path: new Path(),
        inner_path: new Path(),
        line: new Path()
      };
      leaves[i].line.strokeColor = "white";
      // leaves[i].path.strokeColor = "white";

      /////////////////////// create random arrays TODO: put this in a function
      let random_x = math.multiply(math.subtract(math.random([half]), 0.5), 10);
      let random_y = math.multiply(math.subtract(math.random([half]), 0.5), 10);
      // create inverse counterpart
      random_x_inv = math.multiply(random_x, -1);

      // create reverse, inverse x counterpart
      random_x = random_x_inv.concat(
        random_x.map((e, i, a) => a[a.length - 1 - i])
      );
      // create reverse y counterpart
      random_y = random_y.concat(
        random_y.map((e, i, a) => a[a.length - 1 - i])
      );
      ///////////////////////////////////////////////////////

      // function for new points
      const newpoint = function(this_path, iteration) {
        this_path.add(
          new Point(
            random_x[iteration] + decagon.segments[iteration].point.x,
            random_y[iteration] + decagon.segments[iteration].point.y
          )
        );
      };

      // add line to shape
      for (j = 0; j < n_leaf_nodes; j++) {
        // add new point
        newpoint(leaves[i].path, j);
      }

      // stretch leaf
      leaves[i].path.scale(2, 4.0);
      leaves[i].inner_path = leaves[i].path.clone();
      leaves[i].inner_path.scale(0.9, 0.7);
      leaves[i].inner_path.smooth();
      leaves[i].inner_path.closed = true;

      // rotate leaf
      // const angle = rotate_straight(leaves[i].path);
      // rotate_straight(leaves[i].inner_path);

      // create line segement
      let points = [];
      point0 = leaves[i].inner_path.segments[0].point;
      point1 = leaves[i].inner_path.segments[half + 1].point;
      sloper = math.abs(point1.y - point0.y) / (n_leaf_nodes / 2); // twice as few scillations as leaf nodes
      arrayer = [];
      for (x = point1.y, z = 0; x < point0.y; x += sloper, z++) {
        let cosine = Math.sin(z * 10);
        leaves[i].line.add(
          new Point(leaves[i].inner_path.segments[0].point.x + cosine * 5, x)
        );
        if (z % 2 == 0) {
          if (z % 4 == 0) {
            direction = -direction_base;
          } else {
            direction = direction_base;
          }
          leaves[i].line.add(
            new Point(
              leaves[i].inner_path.segments[0].point.x + cosine * 5 - direction,
              x - line_diag
            )
          );
          leaves[i].line.add(
            new Point(leaves[i].inner_path.segments[0].point.x + cosine * 5, x)
          );
        } else {
          direction = -direction_base;
        }
      }
      leaves[i].line.smooth();
      leaves[i].line.scale(1, 0.9);

      leaves[i].path.closed = true;
      leaves[i].path.fillColor = outer_color[i];

      leaves[i].path.strokeColor = "black";
      leaves[i].path.smooth();
      leaves[i].line.strokeWidth = 1;
      leaves[i].line.strokeColor = "black";
      leaves[i].inner_path.strokeWidth = 1;
      leaves[i].inner_path.fillColor = inner_color[i];
      leaves[i].inner_path.strokeColor = "black";
      leaves[i].path.strokeWidth = 1;
    } // end leaf for-loop

    let counter = 0;

    // give movement
    view.onFrame = function(event) {
      for (leaf = 0; leaf < n_leaves; leaf++) {
        for (let j = 0; j < leaves[leaf].line.segments.length; j++) {
          var cosine2 = Math.cos(event.time * 0.5 + j);

          leaves[leaf].path.position.x += cosine2 * height;
          leaves[leaf].inner_path.position.x += cosine2 * height;
          leaves[leaf].line.position.x += cosine2 * height;

          leaves[leaf].path.position.y += cosine2 * height;
          leaves[leaf].inner_path.position.y += cosine2 * height;
          leaves[leaf].line.position.y += cosine2 * height;
        }

        // loop through sections of path
        for (let i = 0; i < n_leaf_nodes; i++) {
          // i=1 makes sure one part is not moving
          // A cylic value between -1 and 1
          var sinus = Math.sin(event.time * 2 + i);
          var cosine = Math.cos(event.time * 2 + i);

          if (i == 0 || i == half) {
            leaves[leaf].path.segments[i].point.y =
              leaves[leaf].path.segments[i].point.y;
            leaves[leaf].path.segments[i].point.x =
              leaves[leaf].path.segments[i].point.x;
            leaves[leaf].inner_path.segments[i].point.y =
              leaves[leaf].path.segments[i].point.y;
            leaves[leaf].inner_path.segments[i].point.x =
              leaves[leaf].path.segments[i].point.x;
          } else {
            // Change the y position of the segment point:
            leaves[leaf].path.segments[i].point.y += sinus * height;
            leaves[leaf].path.segments[i].point.x += cosine * height;
            leaves[leaf].line.segments[i].point.x += cosine * height;

            leaves[leaf].inner_path.segments[i].point.y += sinus * height;
            leaves[leaf].inner_path.segments[i].point.x += cosine * height;
            leaves[leaf].inner_path.segments[i].point.x += cosine * height;
          }
        }
      }
    };
  }
});
