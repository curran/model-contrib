define(["lodash", "model", "sql"], function (_, Model, SQL) {
  return function SQLTransform(){

    var model = Model();

    model.when(["data", "columns"], function (data, columns) {
      // Create a database. See https://github.com/lovasoa/sql.js/blob/master/test/test_statement.js
      var db = new SQL.Database();
      db.run(insertTable(data, columns));
      model.db = db;
    });

    model.when(["db", "sql"], function (db, sql) {
      model.outputData = transformResult(db.exec(sql));
    });

    function insertTable(data, columns){
      var stmts = [createTable(columns)];

      data.forEach( function (d) {
        stmts.push(insertRow(columns, d));
      });

      return stmts.join("\n");
    }

    function createTable(columns){
      var strBuilder = [];

      strBuilder.push("CREATE TABLE hello (");
      strBuilder.push(columns.map(function (column) {
        return column.name + " " + column.type;
      }).join(","));
      strBuilder.push(");");

      return strBuilder.join("");
    }

    function insertRow(columns, d){
      return [
        "INSERT INTO hello VALUES (",
        columns.map(_.partial(columnInsertEntry, d)).join(","),
        ");"
      ].join("");
    }

    function columnInsertEntry(d, column) {
      if(column.type === "char"){
        return "'" + d[column.name] + "'";
      } else {
        return d[column.name];
      }
    }

    function transformResult(result){
      var table = result[0];
      return table.values.map(_.partial(_.zipObject, table.columns));
    }

    return model;
  };
});
