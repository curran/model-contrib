// An example use of the wordCloud module.
// Curran Kelleher August 2014
require(["d3", "modelContrib/wordCloud"], function(d3, WordCloud) {
  var container = document.getElementById("container"),
    wordCloud = WordCloud(container),
    csvPath = "../../data/cars.csv";

  // Set cloud properties.
  wordCloud.set({
    font: "Impact"
  });

  // Load the Tab Separated Value (TSV) data file.
  d3.csv(csvPath, type, function(error, cars) {

    // Only interested in showing car names
    cars = cars.map(function(car) {
      return car.name;
    });

    // Initialize the word cloud with the full data.
    wordCloud.text = cars.join(" ");

    // Periodically set random data
    // to demonstrate that the bars respond to data.
    setInterval(function() {
      wordCloud.text = cars.filter(function() {
        return Math.random() < 0.5
      }).join(" ");
    }, 1000);

  });

  // Runs for each row of the input data
  // See https://github.com/mbostock/d3/wiki/CSV#csv
  function type(d) {

    // Parse strings to Numbers for the frequency attribute.
    d.frequency = +d.frequency;
    return d;
  }

  // Set the word cloud size
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
