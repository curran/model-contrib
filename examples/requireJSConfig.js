require.config({
  paths: {
    d3: '../../bower_components/d3/d3.min',
    model: '../../bower_components/model/dist/model',
    modelContrib: '../../modules/',
    lodash: "../../bower_components/lodash/dist/lodash",
    sql: "../../bower_components/sql.js/js/sql"
  },
  shim: {
    sql: {
      exports: "SQL"
    }
  }
});
