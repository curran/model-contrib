// This program indexes examples into a JSON file
// that is used by the project home page and example viewer.
var _ = require('underscore'),
    marked = require('marked'),
    fs = require('fs'),
    outputFile = 'index.json',
    examplesPath = 'examples/',
    modulesPath = 'modules/',

    // These files are excluded from the example code viewer.
    irrelevantFiles = ['README.md'];

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
  var examples = fs.readdirSync(examplesPath),
      modules = fs.readdirSync(modulesPath);
  return {
    examples: examples

    // Include only directories. Draws from
    // http://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
      .filter(function (name) {
        var stat = fs.statSync(examplesPath + name)
        return stat.isDirectory()
      })
      .map(function (name) {
        return {
          name: name,
          files: listFilesForExample(name)
        };
      }),
    modules: modules.map(function (name) {
      return {
        name: name.replace(".js", "")
      }
    })
  };
}

// Computes the list of files for each example.
function listFilesForExample(name){
  var path = examplesPath + name,
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
