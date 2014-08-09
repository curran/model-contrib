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

  barChart.set({
    xAttribute: "species",
    yAttribute: "count",
    yAxisLabel: "number of irises"
  });

  // Compute the aggregated iris data in response to brushing
  // in the scatter plot, and pass it into the bar chart.
  scatterPlot.when("selectedData", function (scatterData) {

    // { species -> Number count }
    var speciesCounts = {};

    // Aggregate scatter plot data by counting 
    // the number of irises for each species.
    scatterData.forEach(function (d) {
      if(!speciesCounts[d.species]){
        speciesCounts[d.species] = 0;
      }
      speciesCounts[d.species]++;
    });

    // Flatten the object containing species counts into an array.
    // Update the bar chart with the aggregated data.
    // Transform the count index into a set of entries in the conventional D3 format.
    barChart.data = Object.keys(speciesCounts).map(function (species) {
      return {
        species: species,
        count: speciesCounts[species]
      };
    });
  });

  // Fetch the data and feed it into the scatterPlot.
  d3.tsv(tsvPath, type, function(error, data) {
    scatterPlot.data = data;
    scatterPlot.selectedData = data;
  });

  // Runs for each row of the input data
  // See https://github.com/mbostock/d3/wiki/CSV#csv
  function type(d) {

    // Parse strings to Numbers for numeric attributes.
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
    return d;
  }

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
