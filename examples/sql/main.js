require(["d3", "lodash", "model", "sql", "modelContrib/table", "sqlTransform"], function (d3, _, Model, SQL, Table, SQLTransform) {
  var container = document.getElementById("container"),
      table = Table(container),
      sqlTransform = SQLTransform(),
      data = [
        { a: 0, b: "hello" },
        { a: 1, b: "world" }
      ],
      columns = [
        { name: "a", label: "A", type: "int" },
        { name: "b", label: "B", type: "char" }
      ];

  sqlTransform.set({
    data: data,
    columns: columns,
    sql: "SELECT * FROM hello"
  });

  table.columns = columns;
  sqlTransform.when("outputData", function (data) {
    table.data = data;
  });
});
