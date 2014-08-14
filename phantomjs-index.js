// This PhantomJS script renders a full size screen capture image
// for each of the examples, writing images under the thumbnails directory.
var page = require('webpage').create(),
    system = require('system'),
    example = system.args[1];
    examplesPath = 'examples/',
    imagesDir = 'thumbnails/',

    // The number of milliseconds to wait before
    // taking a screen capture of the page.
    waitTime = 500;

// The dimensions in pixels of the page to render.
page.viewportSize = {
  width: 960,
  height: 480
};

// The maximum height is specified here.
// Without this line, the rendered pages will go down vertically
// further than the viewport height.
// See http://phantomjs.org/api/webpage/property/clip-rect.html
page.clipRect = {
  top: 0,
  left: 0,
  width: page.viewportSize.width,
  height: page.viewportSize.height
};

// Pass console output to command line client for debugging.
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

// Open the page that is being served from the local server (server.js must be running).
page.open('http://localhost:8000/' + examplesPath + example + '/index.html', function (status) {

  // Wait some time for the data to load in the page.
  setTimeout(function () {

    // The default PhantomJS background is gray,
    // so set it to be white, like a browser.
    page.evaluate(function() {
      document.body.bgColor = 'white';
    });

    // Render the output image.
    page.render(imagePath(example));

    phantom.exit();
  }, waitTime);
});

function imagePath(example){
  return imagesDir + example + '.png';
}
