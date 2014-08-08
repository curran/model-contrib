// This program indexes examples into a JSON file
// that is used by the project home page and example viewer.
var _ = require('underscore'),
    marked = require('marked'),
    fs = require('fs'),
    outputFile = './index.json',
    entryDir = '../examples/',

    // These files are not excluded from the example code viewer.
    irrelevantFiles = ['message.txt', 'README.md'];

// Generate the data describing the examples.
var index = generateIndex(), 

    // Serialize the data.
    json = JSON.stringify(index, null, 2);

// Write the JSON file used by the example viewer.
write(outputFile, json);

function write(outputFile, output){
  fs.writeFile(outputFile, output, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Wrote file " + outputFile);
    }
  });
}

function generateIndex(){
  var files = fs.readdirSync(entryDir);
  return files.map(function (name) {
    var entry = {
      name: name,
      files: listFilesForExample(name),
    };
    console.log(entry);
    return entry;
  });

}

// Computes the list of files for each example.
function listFilesForExample(name){
  var path = entryDir + name,
      allFiles = fs.readdirSync(path),
      files = _.difference(allFiles, irrelevantFiles);
  return _.sortBy(files, filePrecedence);
}

// Sorts files by:
// index.html > *.html > *.js > *.json > *
function filePrecedence(name){
  var ext = name.substr(name.lastIndexOf('.'));

  if(name === 'index.html'){
    return 0;
  } else if (ext === '.html') {
    return 1;
  } else if (ext === '.js') {
    return 2;
  } else if (ext === '.json') {
    return 3;
  } else {
    return 4;
  }

}
