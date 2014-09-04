// This module implements a dummy visualization
// demonstrating the API structure for authoring visualizations
// that work with the `overseer` framework and nested box layout.
//
// Curran Kelleher September 2014
define(["d3", "model", "lodash"], function (d3, Model, _) {

  return function DummyVis(overseer) {

    // Create the reactive model that will contain the
    // configuration options for the visualization.
    var model = Model(),

        // Create a DOM element for the visualization.
        // CSS will be used later to size and position this element.
        // `createElementNS` is used because the SVG does not render when
        // simply using `createElement("svg")`.
        // See https://developer.mozilla.org/en-US/docs/Web/API/document.createElementNS
        el = document.createElementNS("http://www.w3.org/2000/svg", "svg"),

        svg = d3.select(el),

        // Add a rect to the SVG,
        // which will be filled with the background color.
        rect = svg.append("rect")

          // The location of the rect will be fixed at (0, 0)
          // with respect to the SVG element.
          .attr("x", 0)
          .attr("y", 0),

        // Add a text element to the SVG,
        // which will render the `text` model property.
        text = svg.append("text")
          .attr("font-size", "7em")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle"),

        // Make the X lines draggable. This shows how to add
        // interaction to visualization modules.
        lineDrag = (function () {
          var x1, x2;
          return d3.behavior.drag()
            .on("dragstart", function (d) {
              x1 = d3.event.sourceEvent.pageX;
            })
            .on("drag", function (d) {
              var x2 = d3.event.sourceEvent.pageX,
                  newLineWidth = model.lineWidth + x2 - x1;
              newLineWidth = newLineWidth < 1 ? 1 : newLineWidth;

              // dragging updates the `lineWidth` model property,
              // which is visible to other visualizations in the overseer.
              model.lineWidth = newLineWidth;
              x1 = x2;
            });
        }());

    // Set default properties on the model.
    model.set({

      // * `el` the DOM element expected by the `boxes` module for layout.
      el: el,

      // * `color` a background color
      color: "white",

      // * `text` a string that gets displayed
      text: "",

      // * `lineWidth` the width of lines for the X
      lineWidth: 8

      // `box` is a property expected to be on all
      // visualization components, and is set by
      // the layout engine.
    });

    // Update the color and text based on the model.
    model.when("color", _.partial(rect.attr, "fill"), rect);

    // Update the text based on the model.
    model.when("text", text.text, text);

    // When the size of the visualization is set
    // by the overseer layout engine,
    model.when("box", function (box) {

      // set the size of the background rect.
      rect
        .attr("width", box.width)
        .attr("height", box.height);

      // Update the text label to be centered.
      text
        .attr("x", box.width / 2)
        .attr("y", box.height / 2);
    });

    // Update the X lines whenever either
    // the `box` or `lineWidth` model properties change.
    model.when(["box", "lineWidth"], function (box, lineWidth) {
      var w = box.width,
          h = box.height,
          lines = svg.selectAll("line").data([
            {x1: 0, y1: 0, x2: w, y2: h},
            {x1: 0, y1: h, x2: w, y2: 0}
          ]);
      lines.enter().append("line");
      lines
        .attr("x1", function (d) { return d.x1; })
        .attr("y1", function (d) { return d.y1; })
        .attr("x2", function (d) { return d.x2; })
        .attr("y2", function (d) { return d.y2; })
        .style("stroke-width", lineWidth)
        .style("stroke-opacity", 0.2)
        .style("stroke", "black")
        .call(lineDrag);
    });

    return model;
  };
});
