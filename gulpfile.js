// This program uses Gulp to run JSHint over the code
// and generate documentation with Docco.
//
// Curran Kelleher
// August 2014
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    docco = require('gulp-docco'),

    // Globs for the module and unit test source files.
    theCode = ['modules/**/*.js'];

// The default task runs all the others.
// This executes when you run "gulp"
gulp.task('default', ['lint', 'docs']);

// Checks code quality using JSHint, outputs a stylish report.
gulp.task('lint', function() {
  gulp.src(theCode)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Runs all the unit tests using Mocha, reports the results.
gulp.task('test', ['build'], function () {
  gulp.src(['tests/**/*.js'])
    .pipe(mocha({ reporter: 'spec' }));
});

// Builds documentation using Docco.
gulp.task('docs', function () {
  gulp.src(theCode).pipe(docco()).pipe(gulp.dest('docs'))
});
