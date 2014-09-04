// This module implements nested box layout for visualization dashboards.
//
// By Curran Kelleher September 2014
define(["model", "lodash"], function (Model, _) {

  return function Boxes (overseer) {

    var model = Model();

    model.when("containerId", function (containerId) {
      model.container = document.getElementById(containerId);
    });

    model.when("container", function (container) {

      // Sets the `box` model property based on the actual
      // size of the dashboard div computed by CSS.
      function setBox(){
        model.box = {
          x: 0,
          y: 0,
          // Use `clientWidth` and `clientHeight` to
          // access the actual size of the dashboard div.
          width: container.clientWidth,
          height: container.clientHeight
        };
      }

      // Call once to initialize
      setBox();

      // Call whenever the browser window changes size
      window.addEventListener("resize", setBox);
    });

    // Compute the layout based on the dashboard div size
    // and the configured layout tree whenever either one changes.
    model.when(["layout", "box", "container"], function (layout, box, container) {

      // Remove all child nodes of the container.
      // See http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Compute the nested box layout.
      computeLayout(layout, box).forEach(function (layoutElement) {

        // For each element, get its model.
        overseer.getModel(layoutElement.name, function (model) {

          // Set the position and size of the layout element.
          d3.select(model.el)
            .style("position", "absolute")
            .style("left", layoutElement.box.x + "px")
            .style("top", layoutElement.box.y + "px")
            .attr("width", layoutElement.box.width)
            .attr("height", layoutElement.box.height);

          // Add the model element as a child of the container.
          container.appendChild(model.el);

          // Set the `box` property on each visualization model
          // to an object with (x, y, width, height) in pixels.
          model.box = layoutElement.box;
        });
      });
    });

    return model;
  };

  // Computes the layout of the visualizations in the dashboard.
  //
  // Arguments:
  //
  // * `node` - either a non-leaf node or a leaf node object.
  //
  //     If `node` is a non-leaf node, it is expected to have the following properties:
  //
  //      * `orientation` - either
  //        * `vertical`, meaning this node is subdivided by vertical splits
  //          with children spreading from left to right, or
  //        * `horizontal`, meaning this node is subdivided by horizontal splits
  //          with children spreading from top to bottom
  //      * `children` - an array of child node objects
  //
  //     If `node` is a leaf node, it is expected to have the following properties:
  //
  //      * `name` - the alias of the visualization in the dashboard configuration
  //      * `size` - a number that determines the size of this node within its parent
  //        * Nodes are sized based on the ratio of their `size` property
  //          relative to the sum of all `size` properties of sibling nodes.
  //
  // * `box` - the bounding box of the node in pixels, having (x, y, width, height) properties.
  //
  //   Returns an array of layout elements, one for each leaf node of the input layout tree.
  //   Each layout element has the following properties:
  //
  //    * `name` - the alias of the visualization in the dashboard configuration
  //    * `box` - the bounding box of the visualization in pixels computed by the layout,
  //      having (x, y, width, height) properties.
  function computeLayout(node, box) {
    var totalSize,
        x = box.x,
        y = box.y;
    if(node.children) {
      totalSize = sum(node.children, size);
      return _.reduce(node.children, function (layoutElements, child) {
        var childBox = {x: x, y: y};
        if (node.orientation === "vertical") {
          childBox.width = box.width * size(child) / totalSize;
          childBox.height = box.height;
          x += childBox.width;
        } else if (node.orientation === "horizontal") {
          childBox.width = box.width;
          childBox.height = box.height * size(child) / totalSize;
          y += childBox.height;
        }
        return layoutElements.concat(computeLayout(child, childBox));
      }, []);
    } else {
      return [{ name: node.name, box: box }];
    }
  }

  // Sums values returned by the specified function
  // when called on each element of an array.
  function sum(arr, fn) {
    return _.reduce(arr, function(memo, item){
      return memo + fn(item);
    }, 0);
  }

  // Evaluates the size of a node.
  // Size defaults to 1 when not provided.
  function size(node) {
    return node.size ? node.size : 1;
  }

});
