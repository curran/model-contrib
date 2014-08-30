// A reusable line chart module.
// 
//  * Draws from the [D3 line chart example](http://bl.ocks.org/mbostock/3883245)
//
// By Curran Kelleher August 2014
define(["d3", "model", "modelContrib/reactivis"], function (d3, Model, Reactivis) {
  return function LineChart(container) {
    var defaults = {
          yAxisNumTicks: 10,
          yAxisTickFormat: "",
          /* TODO implement xAxisTickFormat*/
          container: container
        },
        model = Model();

    // Build up the visualization DOM from the container.
    Reactivis.svg(model);

    // Use conventional margins.
    // This call also sets up a default margin.
    Reactivis.margin(model);

    // Use an X time scale with the data min as the minimum value.
    Reactivis.xTimeScale(model);
    Reactivis.xDomain(model);
    Reactivis.xAxis(model);

    // Use a Y linear scale with the data min as the minimum value.
    Reactivis.yDomain(model);
    Reactivis.yLinearScale(model);
    Reactivis.yAxis(model);

    // Set the defaults provide by the constructor invoker,
    // overriding model values previously set by Reactivis methods (e.g. `margin`)
    model.set(defaults);

    // Add an SVG group to contain the line.
    model.when("g", function (g) {
      model.lineG = g.append("g");
    });

    model.when("lineG", function (lineG) {
      model.linePath = lineG.append('path').attr('class', 'line');
    });

    // Draw the line.
    model.when(["linePath", "data", "xAttribute", "yAttribute", "xScale", "yScale"],
        function (linePath, data, xAttribute, yAttribute, xScale, yScale) {

      var line = d3.svg.line()
        .x(function(d) { return xScale(d[xAttribute]); })
        .y(function(d) { return yScale(d[yAttribute]); });

      // Plot the data as a line
      linePath.attr('d', line(data));
    });

    return model;
  };
});
