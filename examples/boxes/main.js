require(["modelContrib/overseer"], function (Overseer) {
  var overseer = Overseer();
  overseer.config = {
    "boxes": {
      "module": "boxes",
      "containerId": "container",
      "layout": {
        "orientation": "vertical",
        "children": [
          {
            "orientation": "horizontal",
            "children": [
              { "name": "a" },
              {
                "size": 2,
                "orientation": "vertical",
                "children": [
                  { "name": "c" },
                  {
                    "size": 2,
                    "orientation": "horizontal",
                    "children": [
                      { "name": "e" },
                      {
                        "orientation": "vertical",
                        "children": [
                          { "name": "f" },
                          { "name": "g" },
                          { "name": "h" },
                          { "name": "i" }
                        ]
                      }
                    ]
                  },
                  { "name": "d" }
                ]
              },
              { "name": "b" }
            ]
          }
        ]
      }
    },
    "a": { "module": "dummyVis", "text": "a", "color": "rgb(237,72,174)" },
    "b": { "module": "dummyVis", "text": "b", "color": "rgb(147,123,191)" },
    "c": { "module": "dummyVis", "text": "c", "color": "rgb(19,231,214)", lineWidth: 150 },
    "d": { "module": "dummyVis", "text": "d", "color": "rgb(0,255,63)"  , lineWidth: 150 },
    "e": { "module": "dummyVis", "text": "e", "color": "rgb(209,224,25)" },
    "f": { "module": "dummyVis", "text": "f", "color": "rgb(241,93,43)" },
    "g": { "module": "dummyVis", "text": "g", "color": "rgb(198,41,223)" },
    "h": { "module": "dummyVis", "text": "h", "color": "rgb(226,78,23)" },
    "i": { "module": "dummyVis", "text": "i", "color": "rgb(209,12,90)" }
  };
});
