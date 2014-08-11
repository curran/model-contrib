// Reusable reactive model data flow subgraphs
// for constructing reactive data visualizations.
//
// By Curran Kelleher August 2014
define(['d3', 'model'], function(d3, Model){
  var Reactivis = {};

  // Encapsulates D3 Conventional Margins.
  // See also http://bl.ocks.org/mbostock/3019563
  Reactivis.margin = function (model) {
    model.when(["box", "margin"], function (box, margin) {
      model.width = box.width - margin.left - margin.right;
      model.height = box.height - margin.top - margin.bottom;
    });
  };
  
  // Creates a Y linear scale.
  // Updates the Y scale based on data, Y attribute and height.
  Reactivis.yLinearScale = function (model) {
    model.when(["data", "yAttribute", "height"], function (data, yAttribute, height) {
      model.yScale = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d[yAttribute]; })]);
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
