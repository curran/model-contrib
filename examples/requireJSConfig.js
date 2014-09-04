require.config({
  paths: {
    modelContrib: "../../modules",
    d3: "../../bower_components/d3/d3.min",
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
