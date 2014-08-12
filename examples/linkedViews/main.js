// An example use of the barChart and scatterPlot modules
// to assemble linked views.
require(["d3", "modelContrib/barChart", "modelContrib/scatterPlot"], function (d3, BarChart, ScatterPlot) {
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

  // Configure the bar chart to use the structure output from
  // the D3 nest operator in response to scatter plot selections.
  barChart.set({
    xAttribute: "key",
    yAttribute: "values",
    yAxisLabel: "number of irises"
  });

  // Compute the aggregated iris data in response to brushing
  // in the scatter plot, and pass it into the bar chart.
  scatterPlot.when("selectedData", function (selectedData) {

    // Aggregate scatter plot data by counting 
    // the number of irises for each species.
    // See https://github.com/mbostock/d3/wiki/Arrays#d3_nest
    barChart.data = d3.nest()
    
      // Group by species
      .key(function (d) { return d.species; })

      // Compute the count of each species
      .rollup(function(values) { return values.length; })

      // Apply the nest operator to the selected data.
      .entries(selectedData);
  });

  // Fetch the data and feed it into the scatterPlot.
  d3.tsv(tsvPath, function type(d) {
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
    return d;
  } , function(error, data) {
    scatterPlot.data = data;
    scatterPlot.selectedData = data;
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
