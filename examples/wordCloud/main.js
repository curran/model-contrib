// An example use of the wordCloud module.
// Curran Kelleher August 2014
require(["d3", "modelContrib/wordCloud"], function(d3, BarChart) {
  var container = document.getElementById("container"),
    wordCloud = BarChart(container),
    tsvPath = "../../data/letterByFrequency.tsv";

  // Set axis properties.
  wordCloud.set({
    xAttribute: "letter",
    xAxisLabel: "Letter",
    yAttribute: "frequency",
    yAxisLabel: "Frequency",
    yAxisTickFormat: "%"
  });

  // Load the Tab Separated Value (TSV) data file.
  d3.tsv(tsvPath, type, function(error, data) {

    // Initialize the bar chart with the full data.
    wordCloud.data = data;

    // Periodically set random data
    // to demonstrate that the bars respond to data.
    setInterval(function() {
      wordCloud.data = data.filter(function() {
        return Math.random() < 0.5
      });
    }, 1000);

    // Periodically update the label
    // to show it is dynamic.
    setInterval(function() {
      var i = Math.floor(Math.random() * 3);
      wordCloud.yAxisLabel = ["A", "B", "C"][i];
    }, 1500);
  });

  // Runs for each row of the input data
  // See https://github.com/mbostock/d3/wiki/CSV#csv
  function type(d) {

    // Parse strings to Numbers for the frequency attribute.
    d.frequency = +d.frequency;
    return d;
  }

  // Set the bar chart size
  // based on the size of its container,
  function computeBox() {
    wordCloud.box = {
      width: container.clientWidth,
      height: container.clientHeight
    };
  }

  // once to initialize `model.box`, and
  computeBox();

  // whenever the browser window resizes in the future.
  window.addEventListener("resize", computeBox);
});
