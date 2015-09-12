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

        container: container,
        font: "Impact",
        wordPadding: 2,
        colors: d3.scale.category20()
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
    model.when(["g", "data", "width", "height"],
      _.throttle(function(g, data, width, height) {

        console.log("Drawing ", model.size);
        model.container.innerHTML = "";

        // Ask d3-cloud to make an cloud object for us
        var myCloud = d3.layout.cloud();

        // Configure our cloud with d3 chaining
        myCloud
          .size([width, height])
          .words(model.data)
          .padding(model.wordPadding)
          .rotate(function() {
            return ~~(Math.random() * 2) * 90;
          })
          .font(model.font)
          .fontSize(function(word) {
            return Math.max(10, word.importance * width);
          })
          .on("end", function(words) {
            myDrawFunction(words, model.container);
          });


        // Declare our own draw function which will be called on the "end" event 
        myDrawFunction = function(words, element) {
          var svg = d3.select(element).append("svg");
          svg.attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(word) {
              return Math.max(10, word.importance * width) + "px";
            })
            .style("font-family", model.font)
            .style("fill", function(word, i) {
              return model.colors(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(word) {
              return "translate(" + [word.x, word.y] + ")rotate(" + word.rotate + ")";
            })
            .text(function(word) {
              return word.text;
            });
        };

        // Run the render when you're ready
        myCloud.start();

      }), transitionDuration);

    return model;
  };
});
