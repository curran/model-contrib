// This is the RequireJS configuration that is used by all examples.
//
// Curran Kelleher November 2014
require.config({
  paths: {

    // Use "modelContrib/someModule" as the module name to load
    // reusable modules provided by modelContrib.
    modelContrib: "../../modules",

    d3: "../../bower_components/d3/d3.min",

    // Required for choropleth maps.
    topojson: "../../bower_components/topojson/topojson",

    model: "../../bower_components/model/dist/model",
    lodash: "../../bower_components/lodash/dist/lodash",
    crossfilter: "../../bower_components/crossfilter/crossfilter",
    sql: "../../bower_components/sql.js/js/sql"
  },
  shim: {
    crossfilter: { exports: "crossfilter" },
    sql: { exports: "SQL" }
  }
});
