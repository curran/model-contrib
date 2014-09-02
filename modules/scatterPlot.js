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
          yAxisNumTicks: 10,
          yAxisTickFormat: "",
          /* TODO implement xAxisTickFormat*/
          container: container,

          /* TODO move brushing into its own reactivis function */
          brushedIntervals: {}
        },
        model = Model();

    // Build up the visualization DOM from the container.
    Reactivis.svg(model);

    // Use conventional margins.
    // This call also sets up a default margin.
    Reactivis.margin(model);

    // Use an X linear scale with the data min as the minimum value.
    Reactivis.xLinearScale(model);
    Reactivis.xDomain(model);
    Reactivis.xAxis(model);

    // Use a Y linear scale with the data min as the minimum value.
    Reactivis.yDomain(model);
    Reactivis.yLinearScale(model);
    Reactivis.yAxis(model);

    // Set the defaults provide by the constructor invoker,
    // overriding model values previously set by Reactivis methods (e.g. `margin`)
    model.set(defaults);

    // Add an SVG group to contain the scatter plot marks.
    model.when("g", function (g) {
      model.dotsG = g.append("g");
    });

    // Add the dots group before the brush group,
    // so that mouse events go to the brush
    // rather than to the dots, even when the mouse is
    // on top of a dot.
    
    // Add an SVG group for the brush.
    model.when("g", function (g) {
      model.brushG = g.append("g").attr("class", "brush");
    });

    // Set up brushing interactions to define `brushedIntervals` on the model.
    model.when(["xAttribute", "yAttribute", "xScale", "yScale"], function (xAttribute, yAttribute, xScale, yScale) {

      var brushedIntervals = {};

      model.brush = d3.svg.brush().on("brush", function () {
        var e = model.brush.extent(),
            xMin = e[0][0],
            yMin = e[0][1],
            xMax = e[1][0],
            yMax = e[1][1];

        // Account for the edge case where the brush is at the 
        // X or Y max. Adding a small value ensures that all points
        // are included when crossfilter's filterRange is used,
        // because filterRange provides an exclusive range, not inclusive.
        // See https://github.com/square/crossfilter/wiki/API-Reference#dimension_filterRange
        if(xMax === xScale.domain()[1]){
          xMax += 0.01;
        }
        if(yMax === yScale.domain()[1]){
          yMax += 0.01;
        }

        if(!model.brush.empty()){
          brushedIntervals[xAttribute] = [xMin, xMax];
          brushedIntervals[yAttribute] = [yMin, yMax];
        } else {
          delete brushedIntervals[xAttribute];
          delete brushedIntervals[yAttribute];
        }
        model.brushedIntervals = brushedIntervals;
      });

    });

    // TODO move this into reactivis.
    model.when(["data", "xAttribute"], function (data, xAttribute) {
      model.getX = function (d) { return d[xAttribute]; };
    });

    model.when(["data", "yAttribute"], function (data, yAttribute) {
      model.getY = function (d) { return d[yAttribute]; };
    });

    // Update the brush based on scales.
    model.when(["brushG", "brush", "xScale", "yScale"], function (brushG, brush, xScale, yScale) {

      // Update the scales within the brush.
      brush.x(xScale);
      brush.y(yScale);

      // Update the extent of the brush to use the new scales.
      // This causes an existing brush to transform in pixel space
      // to reflect the new scales (without this line, the brush stays static).
      brush.extent(brush.extent());

      // Render the brush onto the brush group.
      brushG.call(brush);
    });

    // Draw the dots.
    model.when(["dotsG", "data", "xAttribute", "yAttribute", "xScale", "yScale"],
        function (dotsG, data, xAttribute, yAttribute, xScale, yScale) {

      // TODO generalize computation of getX, getY
      var getX = function (d) { return d[xAttribute]; };
      var getY = function (d) { return d[yAttribute]; };

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
