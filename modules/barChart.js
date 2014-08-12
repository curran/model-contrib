// A reusable bar chart module.
//
//  * Draws from the [D3 bar chart example](http://bl.ocks.org/mbostock/3885304).
//  * Development steps shown in this [Model.js YouTube Video](http://youtu.be/TpZqVAtQs94?t=12m27s)
//  * See also the [Example sequence](http://curran.github.io/screencasts/reactiveDataVis/examples/viewer/index.html#/1) from the video
//  * Also demonstrated in the [model-contrib barChart example](../#/barChart)
//
// Usage:
//
// ```
// var barChart = BarChart(document.getElementById("container"));
// barChart.set({
//   xAttribute: "id",
//   yAttribute: "quantity",
//   yAxisLabel: "Amount",
//   yAxisTickFormat: "%"
// });
// barChart.data = [
//   {id: "A", quantity: 2},
//   {id: "A", quantity: 2}
// ];
// ```
//
// By Curran Kelleher August 2014
define(["d3", "model", "modelContrib/reactivis"], function (d3, Model, Reactivis) {
  return function BarChart (container) {
    var defaults = {
          margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
          },
          yAxisNumTicks: 10,
          yAxisTickFormat: "",
          container: container
        },
        model = Model();


    model.set(defaults);

    // Use conventional margins.
    Reactivis.margin(model);

    // Use an ordinal X scale for defining bars.
    Reactivis.xOrdinalScale(model);

    // Display an X axis with bar names.
    Reactivis.xAxis(model);

    // Use a Y linear scale with zero as the minimum for bar height.
    Reactivis.yDomain(model, { zeroMin: true });
    Reactivis.yLinearScale(model);

    // Build up the visualization DOM from the container.
    Reactivis.svg(model);


    var yAxis = d3.svg.axis().orient("left");
    model.when("g", function (g) {
      model.yAxisG = g.append("g").attr("class", "y axis");
    });

    model.when("yAxisG", function (yAxisG) {
      model.yAxisText = yAxisG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
    });

    // Adjust Y axis tick mark parameters.
    // See https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_tickFormat
    model.when(['yAxisNumTicks', 'yAxisTickFormat'], function (count, format) {
      yAxis.ticks(count, format);
    });


    // Update the Y axis based on the Y scale.
    model.when(["yAxisG", "yScale"], function (yAxisG, yScale) {
      yAxis.scale(yScale);
      yAxisG.call(yAxis);
    });

    // Update Y axis label.
    model.when(["yAxisText", "yAxisLabel"], function (yAxisText, yAxisLabel) {
      yAxisText.text(yAxisLabel);
    });

    // Draw the bars.
    model.when(["g", "data", "xAttribute", "yAttribute", "xScale", "yScale", "height"],
        function (g, data, xAttribute, yAttribute, xScale, yScale, height) {

      var bars = g.selectAll(".bar").data(data);

      bars.enter().append("rect").attr("class", "bar");

      bars.attr("x", function(d) { return xScale(d[xAttribute]); })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) { return yScale(d[yAttribute]); })
        .attr("height", function(d) { return height - yScale(d[yAttribute]); });

      bars.exit().remove();
    });

    return model;
  };
});
