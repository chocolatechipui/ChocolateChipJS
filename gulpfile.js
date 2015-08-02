// Import modules:

var gulp = require('gulp');
var pkg = require('./package.json');
var gutils = require('gulp-util');
var path = require("path");
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var footer = require('gulp-footer');
var ts = require('gulp-typescript');
var beautify = require('gulp-jsbeautifier');
var version = pkg.version;

//Add Trailing slash to projectPath if not exists.
if (pkg.projectPath !== "")
  pkg.projectPath = pkg.projectPath.replace(/\/?$/, '/');

// Define header for ChUI files:
var chocolatechipjsHeader = ['/*',
  '    pO\\',
  '   6  /\\',
  '     /OO\\',
  '    /OOOO\\',
  '   /OOOOOO\\',
  '  (OOOOOOOO)',
  '   \\:~==~:/',
  '',
  '<%= pkg.title %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

// Define header for minfied ChUI files:
var chocolatechipjsHeaderMin = ['/*',
  '<%= pkg.title %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

var testHeader = [
  "<!doctype html>",
  "<html>",
  "  <head>",
  "    <meta charset='UTF-8'>",
  "    <meta http-equiv='content-type' content='text/html; charset=utf-8'>",
  "    <title>QUnit ChocolateChipJS</title>",
  "    <link rel='stylesheet' href='../qunit/qunit.css'>",
  "    <script src='../../dist/chocolatechipjs-<%= pkg.version %>.js'></script>",
  "    <script src='../qunit/qunit.js'></script>",
  "</head>\n"
].join('\n');

var typescriptDirectory = "src/typescript/";
var typescriptFiles = [
  "core.ts",
  "utils.ts",
  "strings.ts",
  "booleans.ts",
  "feature-detection.ts",
  "cache.ts",
  "data.ts",
  "dom-methods.ts",
  "events.ts",
  "promises.ts",
  "fetch.ts",
  "form.ts",
  "pubsub.ts",
  "template.ts"].map(function (f) {
  return path.join(typescriptDirectory, f);
});

// TypeScript Build Task:
gulp.task('build', function () {
  var files = gulp.src(typescriptFiles);
  
  var tsResult = files.pipe(ts({
    noImplicitAny: false,
    target: 'es5',
    removeComments: true,
    out: 'chocolatechipjs-' + pkg.version + '.js'
  }));
  
  return tsResult.js.pipe(replace("var chocolatechipjs;", ''))
  .pipe(replace(" \|\| (chocolatechipjs = \{\})", ''))
  .pipe(replace(/VERSION_NUMBER/img, version ))
  .pipe(header(chocolatechipjsHeader, { pkg : pkg, chuiName: pkg.title }))
  .pipe(beautify({indentSize: 2}))
  .pipe(gulp.dest(pkg.projectPath + './dist'))
  // jshint and options:
  .pipe(jshint({
    curly: false,
    browser: true,
    eqeqeq: true,
    forin: false,
    immed: false,
    expr: false,
    indent: false,
    noempty: true,
    plusplus: false,
    unused: false,
    boss: true,
    evil: true,
    laxbreak: true,
    multistr: true,
    scripturl: true,
    "-W030": true,
    "-W083": false,
    "-W069": false
  }))
  .pipe(jshint.reporter('default'))
  .pipe(uglify())
  .pipe(header(chocolatechipjsHeaderMin, { pkg : pkg, chuiName: pkg.title }))
  .pipe(rename("chocolatechipjs-" + pkg.version + ".min.js"))
  .pipe(gulp.dest(pkg.projectPath + './dist/'));
});

// Create Tests:
gulp.task('tests', function() {
  gulp.src('src/tests/qunit/*')
    .pipe(gulp.dest('tests/qunit'));

  gulp.src('src/tests/chocolatechipjs/*.js')
    .pipe(gulp.dest('tests/chocolatechipjs'));

  gulp.src('src/tests/chocolatechipjs/*.html')
    .pipe(header(testHeader, {pkg: pkg}))
    .pipe(gulp.dest('tests/chocolatechipjs'))

  gulp.src('src/examples/*')
    .pipe(replace('REPLACE_CHOCOLATECHIPJS_VERSION', pkg.version))
    .pipe(gulp.dest('examples/'));

  gulp.src(["./src/typings/chocolatechipjs/chocolatechipjs.d.ts"])
   .pipe(footer("\ndeclare var chocolatechipjs: ChocolateChipStatic;"))
    .pipe(gulp.dest(pkg.projectPath + './typings/chocolatechipjs'));
  gulp.src(["./src/typings/tsd.d.ts"])
    .pipe(gulp.dest(pkg.projectPath + './typings/'));
  gulp.src("./src/typings/tsd.json")
    .pipe(gulp.dest('./'));
  
  gulp.src([
    './src/fetch/*/**',
    './src/fetch/*'
    ])
    .pipe(replace('REPLACE_CHOCOLATECHIPJS_VERSION', pkg.version))
    .pipe(gulp.dest('fetch'))

});

/* 
   Define default task:
   To build, just enter gulp in terminal.
*/
gulp.task('default', ['build', 'tests']);
