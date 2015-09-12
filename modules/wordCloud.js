// A reusable bar chart module.
//
//  * Draws from the [D3 bar chart example](http://bl.ocks.org/mbostock/3885304).
//  * Development steps shown in this [Model.js YouTube Video](http://youtu.be/TpZqVAtQs94?t=12m27s)
//  * See also the [Example sequence](http://curran.github.io/screencasts/reactiveDataVis/examples/viewer/index.html#/1) from the video
//  * Also demonstrated in the [model-contrib wordCloud example](../#/wordCloud)
//
// By Curran Kelleher August 2014
define(["d3", "d3_cloud", "lodash", "model", "modelContrib/reactivis"], function(d3, cloud, _, Model, Reactivis) {


  // Remove punctation and count repeated words. 
  // Kinda works on languages that have spaces
  var getRoughWordCountsFromAText = function(text) {
    var frequencyMap = {
      tokens: 0,
      types: 0
    };
    text
      .replace(/[!\.,:;\?&+_-]/g, ' ')
      .split(/[ \t\n]+/)
      .map(function(word) {
        if (!word || word.length < 3) {
          return;
        }
        if (frequencyMap[word]) {
          frequencyMap[word].count++;
        } else {
          frequencyMap[word] = {
            text: word,
            count: 1
          };
          frequencyMap.types++;
        }
        frequencyMap.tokens++;
      });

    var wordsArray = [];
    for (var word in frequencyMap) {
      if (frequencyMap.hasOwnProperty(word) && word !== "tokens" && word !== "types") {
        frequencyMap[word].importance = frequencyMap[word].count / frequencyMap.types;
        wordsArray.push(frequencyMap[word]);
      }
    }
    wordsArray.tokenCount = frequencyMap.tokens;
    return wordsArray;
  };

  // The module constructor accepts a `container` argument,
  // which is an empty DOM element such as a div.
  return function WordCloud(container) {

    var defaults = {

        // TODO move these into defaults set by Reactivis
        yAxisNumTicks: 10,
        yAxisTickFormat: "",

        container: container
      },
      model = Model(),

      // TODO move this into reactivis defaults (default should be 0)
      transitionDuration = 100;

    // Set defaults on the model.
    model.set(defaults);

    // build up the visualization dom from the container.
    Reactivis.svg(model);

    // Use conventional margins.
    Reactivis.margin(model);

    model.when(["text"], _.throttle(function(text) {
      model.data = getRoughWordCountsFromAText(text.replace(/[0-9]/g, ''));
      model.size = model.data.tokenCount;
      delete model.data.tokenCount;
      console.log(" Data is now" + model.size, model.data);
    }), transitionDuration);

    // Draw the bars.
    model.when(["g", "data", "xAttribute", "yAttribute", "xScale", "yScale", "height"],
      _.throttle(function(g, data, xAttribute, yAttribute, xScale, yScale, height) {

        var bars = g.selectAll(".bar").data(data);

        bars.enter().append("rect").attr("class", "bar");

        bars
          .transition().duration(transitionDuration)
          .attr("x", function(d) {
            return xScale(d[xAttribute]);
          })
          .attr("width", xScale.rangeBand())
          .attr("y", function(d) {
            return yScale(d[yAttribute]);
          })
          .attr("height", function(d) {
            return height - yScale(d[yAttribute]);
          });

        bars.exit().remove();
      }), transitionDuration);

    return model;
  };
});
