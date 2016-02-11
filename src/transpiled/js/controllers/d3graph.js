"use strict";

app.controller("graphController", function ($scope) {
  var gData = [{ "x_axis": 30, "y_axis": 30, "radius": 20, "color": "green", "nx": 30, "ny": 20, "year": 2008 }, { "x_axis": 70, "y_axis": 70, "radius": 20, "color": "purple", "nx": 100, "ny": 200, "year": 2009 }, { "x_axis": 110, "y_axis": 100, "radius": 20, "color": "red", "nx": 200, "ny": 20, "year": 2010 }, { "x_axis": 30, "y_axis": 30, "radius": 20, "color": "green", "nx": 30, "ny": 20, "year": 2009 }, { "x_axis": 70, "y_axis": 70, "radius": 20, "color": "purple", "nx": 100, "ny": 200, "year": 2008 }, { "x_axis": 110, "y_axis": 100, "radius": 20, "color": "red", "nx": 200, "ny": 20, "year": 2010 }, { "x_axis": 30, "y_axis": 30, "radius": 20, "color": "green", "nx": 30, "ny": 20, "year": 2008 }, { "x_axis": 70, "y_axis": 70, "radius": 20, "color": "purple", "nx": 100, "ny": 200, "year": 2010 }, { "x_axis": 110, "y_axis": 100, "radius": 20, "color": "red", "nx": 200, "ny": 20, "year": 2009 }];
  var width = 940;
  var height = 600;
  var year_centers = {
    "2008": { x: width / 3, y: height / 2 },
    "2009": { x: width / 2, y: height / 2 },
    "2010": { x: 2 * width / 3, y: height / 2 }
  };

  var canvas = d3.select(".d3Graph").append("svg").attr("width", 940).attr("height", 600);

  var circles = canvas.selectAll("circle").data(gData).enter().append("circle");

  var circleAttributes = circles.attr("cx", function (d) {
    return d.x_axis;
  }).attr("cy", function (d) {
    return d.y_axis;
  }).attr("r", 0).style("fill", function (d) {
    return d.color;
  });

  circleAttributes.transition().duration(2000).attr("r", function (d) {
    return d.radius;
  });

  var force = d3.layout.force().nodes(gData).size([940, 600]).friction(0.9).charge(function (d) {
    return -Math.pow(d.radius, 2) / 8;
  }).gravity(0.1).alpha(0.1).start();

  force.on("tick", function () {
    circles.attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    }).call(force.drag);
  });

  $scope.move = function () {
    force.gravity(0.1).friction(0.9).charge(function (d) {
      return -Math.pow(d.radius, 2) / 8;
    }).on("tick", function (e) {
      circles.each($scope.changep(e.alpha)).attr("cx", function (d) {
        return d.x + 100;
      }).attr("cy", function (d) {
        return d.y + 40;
      }).call(force.drag);
    });
  };

  $scope.changep = function (alpha) {
    return function (d) {
      var target;
      target = { x: d.nx, y: d.ny };
      d.x = d.x + (target.x - d.x) * (0.1 + 0.02) * alpha * 1.1;
      return d.y = d.y + (target.y - d.y) * (0.1 + 0.02) * alpha * 1.1;
    };
  };

  $scope.moveByYear = function () {
    force.gravity(0.1).friction(0.9).charge(function (d) {
      return -Math.pow(d.radius, 2) / 8;
    }).on("tick", function (e) {
      circles.each($scope.changepy(e.alpha)).attr("cx", function (d) {
        return d.x + 100;
      }).attr("cy", function (d) {
        return d.y + 40;
      }).call(force.drag);
    });
  };

  $scope.changepy = function (alpha) {
    return function (d) {
      var yearData = year_centers[d.year];
      var target;
      target = { x: yearData.x, y: yearData.y };
      d.x = d.x + (target.x - d.x) * (0.1 + 0.02) * alpha * 1.1;
      return d.y = d.y + (target.y - d.y) * (0.1 + 0.02) * alpha * 1.1;
    };
  };
});
//# sourceMappingURL=d3graph.js.map