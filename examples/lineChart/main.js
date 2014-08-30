require(["d3", "modelContrib/lineChart"], function (d3, LineChart) {
  var container = document.getElementById("container"),
      lineChart = LineChart(container),
      tsvPath = "../../data/stock.tsv",
      parseDate = d3.time.format("%d-%b-%y").parse;

  lineChart.set({
    xAttribute: "date",
    xAxisLabel: "Date",

    yAttribute: "close",
    yAxisLabel: "Closing Price",

    margin: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    }

    // TODO add $ format to axis ticks
  });

  d3.tsv(tsvPath, type, function(error, data) {
    // Initialize the visualization with the full data.
    lineChart.data = data;

    // Reset data as a random sample each second.
    setInterval(function () {

      // Include each element with a 10% chance.
      lineChart.data = data.filter(function(d){
        return Math.random() < 0.1;
      });
    }, 1000);

  });

  // Runs for each row of the input data
  // See https://github.com/mbostock/d3/wiki/CSV#csv
  function type(d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
    return d;
  }

  // Sets the `box` model property
  // based on the size of the container,
  // TODO move this logic into reactivis
  function computeBox(){
    lineChart.box = {
      width: container.clientWidth,
      height: container.clientHeight
    };
  }

  // once to initialize `model.box`, and
  computeBox();

  // whenever the browser window resizes in the future.
  window.addEventListener("resize", computeBox);
});
