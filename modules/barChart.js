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
define(["d3", "model"], function (d3, Model) {
  return function BarChart (container) {
    var defaults = {
          margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
          },
          yAxisNumTicks: 10,
          yAxisTickFormat: ""
        },
        model = Model(),
        xAxis = d3.svg.axis().orient("bottom"),
        yAxis = d3.svg.axis().orient("left"),
        svg = d3.select(container).append('svg')

          // Use absolute positioning on the SVG element 
          // so that CSS can be used to position the div later
          // according to the model `box.x` and `box.y` properties.
          .style('position', 'absolute'),

        g = svg.append("g"),
        xAxisG = g.append("g").attr("class", "x axis"),
        yAxisG = g.append("g").attr("class", "y axis"),
        yAxisText = yAxisG.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");
    model.set(defaults);

    // Encapsulate D3 Conventional Margins.
    // See also http://bl.ocks.org/mbostock/3019563
    model.when(["box", "margin"], function (box, margin) {
      model.width = box.width - margin.left - margin.right;
      model.height = box.height - margin.top - margin.bottom;
    });
    model.when("margin", function (margin) {
      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    });

    // Adjust Y axis tick mark parameters.
    // See https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_tickFormat
    model.when(['yAxisNumTicks', 'yAxisTickFormat'], function (count, format) {
      yAxis.ticks(count, format);
    });

    // Respond to changes in size and offset.
    model.when("box", function (box) {

      // Resize the svg element that contains the visualization.
      svg.attr("width", box.width).attr("height", box.height);

      // Set the CSS `left` and `top` properties
      // to move the SVG element to `(box.x, box.y)`
      // relative to the container div to apply the offset.
      svg
        .style('left', box.x + 'px')
        .style('top', box.y + 'px');
    });

    model.when("height", function (height) {
      xAxisG.attr("transform", "translate(0," + height + ")");
    });

    model.when(["data", "xAttribute", "width"], function (data, xAttribute, width) {
      model.xScale = d3.scale.ordinal()
        // TODO make 0.1 into a model property
        .rangeRoundBands([0, width], 0.1)
        .domain(data.map(function(d) { return d[xAttribute]; }));
    });

    model.when(["data", "yAttribute", "height"], function (data, yAttribute, height) {
      model.yScale = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d[yAttribute]; })]);
    });

    model.when(["xScale"], function (xScale) {
      xAxis.scale(xScale);
      xAxisG.call(xAxis);
    });

    model.when(["yScale"], function (yScale) {
      yAxis.scale(yScale);
      yAxisG.call(yAxis);
    });

    model.when("yAxisLabel", yAxisText.text, yAxisText);

    model.when(["data", "xAttribute", "yAttribute", "xScale", "yScale", "height"],
        function (data, xAttribute, yAttribute, xScale, yScale, height) {
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
