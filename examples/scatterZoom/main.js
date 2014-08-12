require(["d3", "modelContrib/barChart", "modelContrib/scatterPlot"], function (d3, BarChart, ScatterPlot) {
  var container = document.getElementById("container"),
      scatterPlotA = ScatterPlot(container);
      scatterPlotB = ScatterPlot(container);
      tsvPath = "../../data/iris.tsv",
      defaults = {
        xAttribute: "sepalWidth",
        xAxisLabel: "Sepal Width (cm)",

        yAttribute: "sepalLength",
        yAxisLabel: "Sepal Length (cm)"
      };

  scatterPlotA.set(defaults);
  scatterPlotB.set(defaults);

  // Link the two scatter plots such that
  // when the brush updates on scatter plot A,
  scatterPlotA.when(["brushedIntervals", "xAttribute", "yAttribute"], function (brushedIntervals, xAttribute, yAttribute) {

    // the scale domains of scatter plot B are set to 
    // the intervals defined by the brush.
    scatterPlotB.yDomain = brushedIntervals[yAttribute];
    scatterPlotB.xDomain = brushedIntervals[xAttribute];
  });

  // Fetch the data and feed it into the scatterPlots.
  d3.tsv(tsvPath, type, function(error, data) {
    scatterPlotA.data = data;
    scatterPlotB.data = data;
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

    // Put scatter plot A on the left.
    scatterPlotA.box = {
      x: 0,
      y: 0,
      width: container.clientWidth / 2,
      height: container.clientHeight
    };

    // Put scatter plot B on the left.
    scatterPlotB.box = {
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
