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

  return Reactivis;
});
