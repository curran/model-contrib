// A reusable scatter plot module.
// 
//  * Draws from the [D3 scatter plot example](http://bl.ocks.org/mbostock/3887118)
//  * Draws from ModelJS conventions used in the [barChart example](http://curran.github.io/model-contrib/#/barChart).
//  * Draws from this [brushing example for interaction](http://bl.ocks.org/mbostock/4343214)
//  * See also [D3 Quadtree documentation](https://github.com/mbostock/d3/wiki/Quadtree-Geom)
//
// By Curran Kelleher August 2014
define(["d3", "model"], function (d3, Model) {
  return function ScatterPlot(container){
    var defaults = {
          margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
          },
          yAxisNumTicks: 10,
          yAxisTickFormat: ""
          /* TODO implement xAxisTickFormat*/
        },
        x = d3.scale.linear(),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left"),

        // Use absolute positioning so that CSS can be used
        // to position the div according to the model.
        svg = d3.select(container).append("svg").style("position", "absolute"),
        g = svg.append("g"),
        xAxisG = g.append("g").attr("class", "x axis"),
        yAxisG = g.append("g").attr("class", "y axis"),
        xAxisLabel = xAxisG.append("text")
          .attr("class", "label")
          .attr("y", -6)
          .style("text-anchor", "end"),
        yAxisLabel = yAxisG.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end"),

        // Add the dots group before the brush group,
        // so that mouse events go to the brush
        // rather than to the dots, even when the mouse is
        // on top of a dot.
        dotsG = g.append("g"),
        brushG = g.append("g")
          .attr("class", "brush"),
        brush = d3.svg.brush()
          .on("brush", brushed),
        dots,
        quadtree,
        model = Model();
    model.set(defaults);

    model.when("xAxisLabel", xAxisLabel.text, xAxisLabel);
    model.when("yAxisLabel", yAxisLabel.text, yAxisLabel);

    model.when("margin", function (margin) {
      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    });

    model.when("box", function (box) {
      svg.attr("width", box.width)
         .attr("height", box.height);

      // Set the CSS `left` and `top` properties
      // to move the SVG element to `(box.x, box.y)`
      // relative to the container div.
      svg
        .style("left", box.x + "px")
        .style("top", box.y + "px");
    });

    model.when(["box", "margin"], function (box, margin) {
      model.width = box.width - margin.left - margin.right;
      model.height = box.height - margin.top - margin.bottom;
    });

    model.when("width", function (width) {
      xAxisLabel.attr("x", width);
    });

    model.when("height", function (height) {
      xAxisG.attr("transform", "translate(0," + height + ")");
    });

    model.when(["width", "height"], function (width, height) {
      brush.x(d3.scale.identity().domain([0, width]));
      brush.y(d3.scale.identity().domain([0, height]));
      brushG
        .call(brush)
        .call(brush.event);
    });

    model.when(["width", "height", "data", "xAttribute", "yAttribute"], function (width, height, data, xAttribute, yAttribute) {

      // Updated the scales
      x.domain(d3.extent(data, function(d) { return d[xAttribute]; })).nice();
      y.domain(d3.extent(data, function(d) { return d[yAttribute]; })).nice();

      x.range([0, width]);
      y.range([height, 0]);

      // update the quadtree
      quadtree = d3.geom.quadtree()
        .x(function(d) { return x(d[xAttribute]); })
        .y(function(d) { return y(d[yAttribute]); })
        (data);

      // update the axes
      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      // Plot the data as dots
      dots = dotsG.selectAll(".dot").data(data);
      dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5);
      dots
        .attr("cx", function(d) { return x(d[xAttribute]); })
        .attr("cy", function(d) { return y(d[yAttribute]); });
      dots.exit().remove();
    });
    return model;

    function brushed() {
      var e = brush.extent(), selectedData;
      if(dots) {
        dots.each(function(d) { d.selected = false; });
        selectedData = search(e[0][0], e[0][1], e[1][0], e[1][1]);
        dots.classed("selected", function(d) { return d.selected; });
      }
      model.selectedData = brush.empty() ? model.data : selectedData;
    }

    // Find the nodes within the specified rectangle.
    function search(x0, y0, x3, y3) {
      var selectedData = [];
      quadtree.visit(function(node, x1, y1, x2, y2) {
        var d = node.point, x, y;
        if (d) {
          x = node.x;
          y = node.y;
          d.visited = true;
          if(x >= x0 && x < x3 && y >= y0 && y < y3){
            d.selected = true;
            selectedData.push(d);
          }
        }
        return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
      });
      return selectedData;
    }
  };
});
