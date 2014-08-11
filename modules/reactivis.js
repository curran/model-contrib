// Reusable reactive model data flow subgraphs
// for constructing reactive data visualizations.
//
// The following properties are conventions used by
// many reusable data flow subgraphs:
//
//  * `data` an array of data elements. For example, this may be set to the array returned from [D3.csv](https://github.com/mbostock/d3/wiki/CSV)
//  * `box` an object representing the outer box of the visualization, having the following properties:
//    * `width` the width of the outer visualization box in pixels
//    * `height` the height of the outer visualization box in pixels
//  * `margin` the [conventional margin](http://bl.ocks.org/mbostock/3019563) object containing the margin of the visualization, having the properties `top`, `right`, `bottom`, `left`.
//  * `width` and `height`, the dimensions of the inner visualization rectangle, computed from `box` and `margin`.
//  * `xAttribute` the attribute found in data elements that maps to the X axis.
//  * `yAttribute` the attribute found in data elements that maps to the Y axis.
//
// By Curran Kelleher August 2014
define(['d3', 'model'], function(d3, Model){
  var Reactivis = {};

  // Encapsulates [D3 Conventional Margins](http://bl.ocks.org/mbostock/3019563).
  // Computes `width` and `height` from `box` and `margin`.
  Reactivis.margin = function (model) {
    model.when(["box", "margin"], function (box, margin) {
      model.width = box.width - margin.left - margin.right;
      model.height = box.height - margin.top - margin.bottom;
    });
  };
  
  // Creates a Y linear scale.
  // Updates the Y scale based on data, Y attribute and height.
  Reactivis.yLinearScale = function (model) {
    model.when(["data", "yDomain", "height"], function (data, yDomain, height) {
      model.yScale = d3.scale.linear()
        .range([height, 0])
        .domain(yDomain);
    });
  };

  // Creates an X linear scale.
  // Updates the X scale based on data, X attribute and width.
  Reactivis.xLinearScale = function (model) {
    model.when(["data", "xAttribute", "width"], function (data, xAttribute, width) {
      model.xScale = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function(d) { return d[xAttribute]; })]);
    });
  };

  // Creates an X ordinal scale.
  // Updates the X scale based on data, X attribute and width.
  Reactivis.xOrdinalScale = function (model) {
    model.when(["data", "xAttribute", "width"], function (data, xAttribute, width) {
      model.xScale = d3.scale.ordinal()
        // TODO make 0.1 into a model property
        .rangeRoundBands([0, width], 0.1)
        .domain(data.map(function(d) { return d[xAttribute]; }));
    });
  };

  return Reactivis;
});
