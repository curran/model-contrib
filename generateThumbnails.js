// This script takes screenshots of examples using PhantomJS,
// then generates thumbnails using graphicsMagick.
//
// Curran Kelleher
// August 2014
var path = require('path'),
    fs = require('fs'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    gm = require('gm'),
    binPath = phantomjs.path,

    // This is the path where images will be output,
    // having the same name as the example that generated them.
    imagesDir = __dirname + '/thumbnails/';

// Read the list of examples from index.json.
fs.readFile('index.json', 'utf8', function (err, data) {

  // Generate a thumbnail image for each example.
  var examples = JSON.parse(data).examples;
  examples.forEach(function (example) {
    generateThumbnail(example.name, function () {
      console.log('Generated thumbnail for ' + example.name);
    });
  });
});

// Generates a thumbnail for a given example.
// Calls the callback when the image has been generated.
function generateThumbnail(example, callback){

  // Render the full-size page capture image.
  renderExample(example, function () {

    // Use gm (GraphicsMagick) to resize the image
    // down to a smaller thumbnail scale.
    var path = imagePath(example);
    gm(path)

      // The thumbnail dimensions in pixels
      .resize(320, 180)

      // Overwrite the full size image with its thumbnail.
      // Change path here to keep full size images.
      .write(path, function (err) {
        if (err) console.log(err);
        else callback();
      });
  });
}

// Gets the path of the PNG image
// for a given example.
function imagePath(example){
  return imagesDir + example + '.png';
}

// Renders the full-size page capture image
// by invoking PhantomJS and running phantomjs-index.js.
function renderExample(example, callback){

  // Run phantomjs-index.js passing the example name as an argument.
  var childArgs = [
    path.join(__dirname, 'phantomjs-index.js'),
    example
  ];
  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {

    // Pass messages out to the command line for debugging.
    console.log(stdout);

    // Notify the callback that the image was rendered.
    callback();
  });
}
