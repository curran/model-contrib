require(["d3", "modelContrib/barChart", "modelContrib/scatterPlot", "modelContrib/table", "crossfilter", "lodash"], function (d3, BarChart, ScatterPlot, Table, Crossfilter, _) {
  var container = document.getElementById("container"),
      tableContainer = document.getElementById("table"),
      barChart = BarChart(container),
      scatterPlot = ScatterPlot(container);
      table = Table(tableContainer);
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

  table.columns = [
    { "label": "Sepal length", "name": "sepalLength" },
    { "label": "Sepal width", "name": "sepalWidth" },
    { "label": "Petal length", "name": "petalLength" },
    { "label": "Petal width", "name": "petalWidth" },
    { "label": "Species", "name": "species" }
  ];

  scatterPlot.when(["data", "xAttribute", "yAttribute"], function (data, xAttribute, yAttribute) {
    var crossfilter = Crossfilter(data),
        speciesDimension = crossfilter.dimension(function (d) { return d.species; }),
        attributes = [xAttribute, yAttribute];

    // Create crossfilter dimensions for each attribute that may be brushed.
    scatterPlot.dimensions = _.zipObject(attributes, attributes.map(function (attribute) {
      return crossfilter.dimension(function (d) {
        return d[attribute];
      });
    }));

    scatterPlot.speciesGroup = speciesDimension.group();
    scatterPlot.speciesDimension = speciesDimension;
  });

  // Compute the aggregated iris data in response to brushing
  // in the scatter plot, and pass it into the bar chart.
  scatterPlot.when(["brushedIntervals", "dimensions", "speciesDimension", "speciesGroup"], function (brushedIntervals, dimensions, speciesDimension, speciesGroup) {

    // Apply filters based on the brushed intervals.
    Object.keys(dimensions).forEach(function (attribute) {
      var interval = brushedIntervals[attribute],
          dimension = dimensions[attribute];
      if(interval){
        dimension.filterRange(interval);
      } else {
        dimension.filterAll();
      }
    });

    // Set the bars to be the filtered set aggregated by species count.
    barChart.data = speciesGroup.all();

    table.data = speciesDimension.top(Infinity);
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
