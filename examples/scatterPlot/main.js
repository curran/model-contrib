// An example program demonstrating use of the
// ScatterPlot module.
//
// By Curran Kelleher August 2014
require(["d3", "modelContrib/scatterPlot"], function (d3, ScatterPlot) {
  var container = document.getElementById("container"),
      scatterPlot = ScatterPlot(container);
      tsvPath = "../../data/iris.tsv";

  // Log the selected data whenever the brush region changes.
  scatterPlot.when("selectedData", function (data) {
    console.log("Selected " + JSON.stringify(data, null, 2));
  });

  // Set axis properties.
  scatterPlot.set({
    xAttribute: "sepalWidth",
    xAxisLabel: "Sepal Width (cm)",

    yAttribute: "sepalLength",
    yAxisLabel: "Sepal Length (cm)"
  });

  // Load the Tab Separated Value (TSV) data file.
  d3.tsv(tsvPath, type, function(error, data) {

    // Initialize the visualization with the full data.
    scatterPlot.data = data;

    // Reset data as a random sample each second,
    // to demonstrate that the plot reacts to changes.
    setInterval(function () {

      // Include each element with a 10% chance.
      scatterPlot.data = data.filter(function(d){
        return Math.random() < 0.1;
      });
    }, 1000);
  });

  // Change the X axis label every 600 ms.
  setInterval(function () {
    scatterPlot.xAxisLabel = randomString();
  }, 600);

  // Change the Y axis label every 800 ms.
  setInterval(function () {
    scatterPlot.yAxisLabel = randomString();
  }, 800);

  // Runs for each row of the input data
  // See https://github.com/mbostock/d3/wiki/CSV#csv
  function type(d) {

    // Parse strings to Numbers for numeric attributes.
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
    return d;
  }

  // Generates a random string for assignment as an axis label.
  function randomString() {
    var possibilities = ["Frequency", "Population", "Alpha", "Beta"],
        i = Math.round(Math.random() * possibilities.length);
    return possibilities[i];
  }

  // Sets the `box` model property
  // based on the size of the container,
  function computeBox(){
    scatterPlot.box = {
      width: container.clientWidth,
      height: container.clientHeight
    };
  }

  // once to initialize `model.box`, and
  computeBox();

  // whenever the browser window resizes in the future.
  window.addEventListener("resize", computeBox);
});
