// A reactive HTML table.
//
//  * Draws from http://bost.ocks.org/mike/nest/
//  * See also the [table example](http://curran.github.io/model-contrib/#/examples/table) for usage.
//
// Model properties used as input include:
//
//  * `data` an array of data elements
//  * `columns` an array of column descriptor objects, each having
//    * `name` the data element property to access, and
//    * `label` the string to display in the table as the column header.
//
// By Curran Kelleher August 2014
define(['d3', 'model', 'lodash'], function (d3, Model, _) {
  return function Table(container) {
    var model = Model(),
        div = d3.select(container)

          // Append the container div
          .append('div'),

        // Append the HTML table to the container div
        table = div.append('table')

          // Use Bootstrap 'table' class
          .attr('class', 'table'),

        // Append table header and table body
        thead = table.append('thead').append('tr'),
        tbody = table.append('tbody'),

        // Re-render the table at most once every 100 ms.
        throttleWait = 100;

    // When the data changes, update the table
    model.when(['data', 'columns'], _.throttle(function (data, columns) {
      var titles, tr, td;

      // Populate the table header
      titles = thead.selectAll('th').data(columns);
      titles.enter().append('th');
      titles.text(function (d) { return d.label; });
      titles.exit().remove();

      // Populate the table rows
      tr = tbody.selectAll('tr').data(data);
      tr.enter().append('tr');
      tr.exit().remove();
      
      // Set the values for each table cell
      td = tr.selectAll('td').data(function (row) {
        return columns.map(function (column) {
          return row[column.name];
        });
      });
      td.enter().append('td');
      td.exit().remove();
      td.text( function (d) { return d; });
    }, throttleWait));

    return model;
  };
});
