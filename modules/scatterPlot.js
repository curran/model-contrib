// A reusable scatter plot module.
// 
//  * Draws from the [D3 scatter plot example](http://bl.ocks.org/mbostock/3887118)
//  * Draws from ModelJS conventions used in the [barChart example](http://curran.github.io/model-contrib/#/barChart).
//  * Draws from this [brushing example for interaction](http://bl.ocks.org/mbostock/4343214)
//  * See also [D3 Quadtree documentation](https://github.com/mbostock/d3/wiki/Quadtree-Geom)
//
// By Curran Kelleher August 2014
define(["d3", "model", "modelContrib/reactivis"], function (d3, Model, Reactivis) {
  return function ScatterPlot(container) {
    var defaults = {
          margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
          },
          yAxisNumTicks: 10,
          yAxisTickFormat: "",
          /* TODO implement xAxisTickFormat*/
          container: container
        },
        model = Model();

    model.set(defaults);

    // Build up the visualization DOM from the container.
    Reactivis.svg(model);

    // Use conventional margins.
    Reactivis.margin(model);

    // Use an X linear scale with the data min as the minimum value.
    Reactivis.xLinearScale(model);
    Reactivis.xDomain(model);
    Reactivis.xAxis(model);

    // Use a Y linear scale with the data min as the minimum value.
    Reactivis.yDomain(model);
    Reactivis.yLinearScale(model);
    Reactivis.yAxis(model);

    model.when("g", function (g) {
      model.dotsG = g.append("g");

      // Add the dots group before the brush group,
      // so that mouse events go to the brush
      // rather than to the dots, even when the mouse is
      // on top of a dot.
      model.brushG = g.append("g").attr("class", "brush");
    });

    // Set up brushing
    model.when(["data", "xAttribute", "yAttribute", "xScale", "yScale"], function (data, xAttribute, yAttribute, xScale, yScale) {

      // TODO generalize computation of getX, getY
      var getX = function (d) { return d[xAttribute]; };
      var getY = function (d) { return d[yAttribute]; };

      var brush = d3.svg.brush();

      brush.on("brush", function () {
        var e = brush.extent(),
            xMin = e[0][0],
            yMin = e[0][1],
            xMax = e[1][0],
            yMax = e[1][1],
            brushedIntervals = {};
        if(!brush.empty()){
          brushedIntervals[xAttribute] = [xMin, xMax];
          brushedIntervals[yAttribute] = [yMin, yMax];
        }
        model.brushedIntervals = brushedIntervals;
      });

      model.brush = brush;
    });

    model.when(["data", "xAttribute"], function (data, xAttribute) {
      model.getX = function (d) { return d[xAttribute]; };
    });

    model.when(["data", "yAttribute"], function (data, yAttribute) {
      model.getY = function (d) { return d[yAttribute]; };
    });

    model.when(["data", "getX", "getY"], function (data, getX, getY) {

      // Create a quadtree index in the data space.
      model.quadtree = d3.geom.quadtree().x(getX).y(getY)(data);
    });

    // Search the quadtree to compute `selectedData` when the `brushedIntervals` change.
    model.when(["brushedIntervals", "quadtree", "xAttribute", "yAttribute", "data"], function (brushedIntervals, quadtree, xAttribute, yAttribute, data) {
      var selectedData;
      if(Object.keys(brushedIntervals).length === 0){
        selectedData = data;
      } else {
        var x0 = brushedIntervals[xAttribute][0],
            y0 = brushedIntervals[yAttribute][0],
            x3 = brushedIntervals[xAttribute][1],
            y3 = brushedIntervals[yAttribute][1];
        selectedData = [];  
        quadtree.visit(function(node, x1, y1, x2, y2) {
          var d = node.point, x, y;
          if (d) {
            x = node.x;
            y = node.y;
            if(x >= x0 && x < x3 && y >= y0 && y < y3){
              selectedData.push(d);
            }
          }
          return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
        });
      }
      model.selectedData = selectedData;
    });

    model.when(["brushG", "brush", "xScale", "yScale"], function (brushG, brush, xScale, yScale) {
      brush.x(xScale);
      brush.y(yScale);
      brushG
        .call(brush)
        .call(brush.event);
    });

    // Draw the dots.
    model.when(["dotsG", "data", "xAttribute", "yAttribute", "xScale", "yScale"],
        function (dotsG, data, xAttribute, yAttribute, xScale, yScale) {

      // TODO generalize computation of getX, getY
      var getX = function (d) { return d[xAttribute]; };
      var getY = function (d) { return d[yAttribute]; };

      // Update the quadtree
      quadtree = d3.geom.quadtree().x(getX).y(getY)(data);

      // Plot the data as dots
      var dots = dotsG.selectAll(".dot").data(data);
      dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5);
      dots
        .attr("cx", function(d) { return xScale(getX(d)); })
        .attr("cy", function(d) { return yScale(getY(d)); });
      dots.exit().remove();
    });

    // TODO deal with this
    // Mark each dot as not selected.
    //dots.each(function(d) {
    //  d.selected = false;
    //});
    //dots.classed("selected", function (d) {
    //  return d.selected;
    //});

    return model;
  };
});
