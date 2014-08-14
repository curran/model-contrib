// An example use of the barChart and scatterPlot modules
// to assemble linked views.
require(["d3", "modelContrib/barChart", "modelContrib/scatterPlot", "crossfilter", "lodash"], function (d3, BarChart, ScatterPlot, Crossfilter, _) {
  var container = document.getElementById("container"),
      barChart = BarChart(container),
      scatterPlot = ScatterPlot(container);
      tsvPath = "../../data/iris.tsv";

  scatterPlot.set({
    xAttribute: "sepalWidth",
    xAxisLabel: "Sepal Width (cm)",

    yAttribute: "sepalLength",
    yAxisLabel: "Sepal Length (cm)"
  });

  barChart.set({
    xAttribute: "key",
    yAttribute: "value",
    yAxisLabel: "number of irises"
  });

  scatterPlot.when(["data", "xAttribute", "yAttribute"], function (data, xAttribute, yAttribute) {
    var crossfilter = Crossfilter(data),
        speciesDimension = crossfilter.dimension(function (d) { return d.species; }),
        dimensions = {};

    dimensions[xAttribute] = crossfilter.dimension(function (d) { return d[xAttribute]; });
    dimensions[yAttribute] = crossfilter.dimension(function (d) { return d[yAttribute]; });
    scatterPlot.dimensions = dimensions;

    scatterPlot.speciesGroup = speciesDimension.group(function (d) { return d; });
  });

  // Compute the aggregated iris data in response to brushing
  // in the scatter plot, and pass it into the bar chart.
  scatterPlot.when(["brushedIntervals", "dimensions", "speciesGroup"], function (brushedIntervals, dimensions, speciesGroup) {

    // Filter based on the brushed intervals.
    var attributes = Object.keys(dimensions);
    if(_.isEmpty(brushedIntervals)){
      attributes.forEach(function (attribute) {
        dimensions[attribute].filter(null);
      });
    } else {
      attributes.forEach(function (attribute) {
        dimensions[attribute].filterRange(brushedIntervals[attribute]);
      })
    }

    // Set the bars to be the filtered set aggregated by species count.
    barChart.data = speciesGroup.all();
  });

  // Fetch the data and feed it into the scatterPlot.
  d3.tsv(tsvPath, function type(d) {
    d.petalLength = +d.petalLength;
    d.petalWidth = +d.petalWidth;
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
    return d;
  }, function(error, data) {
    scatterPlot.data = data;
  });

  // Set the visualization boxes.
  function computeBoxes(){

    // Put the scatter plot on the left.
    scatterPlot.box = {
      x: 0,
      y: 0,
      width: container.clientWidth / 2,
      height: container.clientHeight
    };

    // Put the bar chart on the right.
    barChart.box = {
      x: container.clientWidth / 2,
      y: 0,
      width: container.clientWidth / 2,
      height: container.clientHeight
    };
  }

  // once to initialize `model.box`, and
  computeBoxes();

  // whenever the browser window resizes in the future.
  window.addEventListener("resize", computeBoxes);
});
