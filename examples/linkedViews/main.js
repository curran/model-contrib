require(["d3", "modelContrib/barChart", "modelContrib/scatterPlot", "modelContrib/table", "crossfilter", "lodash"], function (d3, BarChart, ScatterPlot, Table, Crossfilter, _) {

  var barChart = BarChart(document.querySelector("#barChart")),
      scatterPlot = ScatterPlot(document.querySelector("#scatterPlot")),
      table = Table(document.querySelector("#table")),
      tsvPath = "../../data/iris.tsv",
   
      // Each visualization has this height,
      // and the width is computed by CSS.
      visHeight = 350;
  

  scatterPlot.set({
    xAttribute: "sepalWidth",
    xAxisLabel: "Sepal Width (cm)",

    yAttribute: "sepalLength",
    yAxisLabel: "Sepal Length (cm)"
  });

  barChart.set({
    xAttribute: "key",
    yAttribute: "value",
    xAxisLabel: "Iris Flower Species",
    yAxisLabel: "Count of Irises"
  });

  table.columns = [
    { "label": "Sepal length", "name": "sepalLength" },
    { "label": "Sepal width", "name": "sepalWidth" },
    { "label": "Petal length", "name": "petalLength" },
    { "label": "Petal width", "name": "petalWidth" },
    { "label": "Species", "name": "species" }
  ];

  // Initialize crossfilter when the data and configuration is ready.
  scatterPlot.when(["data", "xAttribute", "yAttribute"], function (data, xAttribute, yAttribute) {

    // Initialize Crossfilter with the scatterPlot data.
    var crossfilter = Crossfilter(data),
    
        // These attribute names will be used to create crossfilter dimensions.
        dimensionAttributes = [xAttribute, yAttribute, "species"],

        // Create crossfilter dimensions for each attribute that may be brushed.
        // In the case of a scatter plot there are only two dimensions,
        // but for a parallel coordinates plot there may be many dimensions necessary.
        dimensionsArray = dimensionAttributes.map(function (attribute) {
          return crossfilter.dimension(function (d) {
            return d[attribute];
          });
        }),

        // Keys are attribute names, values are crossfilter dimension objects.
        dimensions = _.zipObject(dimensionAttributes, dimensionsArray),

        groupAttributes = ["species"];
        groupsArray = groupAttributes.map(function (attribute) {
          return dimensions[attribute].group();
        }),
        groups = _.zipObject(groupAttributes, groupsArray);

    scatterPlot.dimensions = dimensions;
    scatterPlot.groups = groups;
  });

  // Compute the aggregated iris data in response to brushing
  // in the scatter plot, and pass it into the bar chart.
  scatterPlot.when(["brushedIntervals", "dimensions", "groups"], function (brushedIntervals, dimensions, groups) {

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

    // Pass the full set of filtered entries into the table, ordered by species.
    table.data = dimensions.species.top(Infinity);

    // Set the bar chart data to be the filtered set aggregated by species count.
    barChart.data = groups.species.all();

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

  function setBox(model, height){
    model.box = {
      x: 0,
      y: 0,
      width: model.container.clientWidth,
      height: height
    };
  }

  // Set the visualization boxes.
  function computeBoxes(){
    setBox(scatterPlot, visHeight);
    setBox(barChart, visHeight);
  }

  // once to initialize `model.box`, and
  computeBoxes();

  // whenever the browser window resizes in the future.
  window.addEventListener("resize", computeBoxes);
});
