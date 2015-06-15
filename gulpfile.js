// Import modules:
var gulp = require('gulp');
var pkg = require('./package.json');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var gutils = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var footer = require('gulp-footer');
var version = pkg.version;
var deferredSupport = false;
var promises = "src/chocolatechip/promises.js";
var ajax = "src/chocolatechip/xhr.js";
var del = require('del');

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
  "   <head>",
  "      <meta charset='UTF-8'>",
  "      <meta http-equiv='content-type' content='text/html; charset=utf-8'>",
  "      <title>QUnit ChocolateChipJS</title>",
  "      <link rel='stylesheet' href='../qunit/qunit.css'>",
  "      <script src='../../dist/chocolatechip-<%= pkg.version %>.js'></script>",
  "      <script src='../qunit/qunit.js'></script>",
  "  </head>\n"
].join('\n');



// Concat, minify and output JavaScript:
gulp.task('js', function () {
  var chuijs_start = [
    '\(function\() {',
    '  \'use strict\';'
  ].join('\n');
  var chuijs_end = '\n\}\)\();';

  var deferredSupport = gutils.env.deferredSupport;
  if (deferredSupport) {
    promises = "src/chocolatechip/deferred.js";
    ajax = "src/chocolatechip/ajax.js"
  }

  gulp.src([
    "src/chocolatechip/returnResult.js",
    "src/chocolatechip/selectors.js",
    "src/chocolatechip/extend.js",
    "src/chocolatechip/core.js",
    "src/chocolatechip/plugin.js",
    "src/chocolatechip/cache.js",
    "src/chocolatechip/collection.js",
    "src/chocolatechip/events.js",
    "src/chocolatechip/data.js",
    "src/chocolatechip/domready.js",
    "src/chocolatechip/animate.js",
    "src/chocolatechip/string.js",
    "src/chocolatechip/form.js", 
    "src/chocolatechip/feature-detection.js",
    promises,
    ajax,
    "src/chocolatechip/templates.js",
    "src/chocolatechip/pubsub.js",
    "src/chocolatechip/expose-chocolatechip.js"
  ])

    .pipe(replace(/^\(function\(\)\{\n  \"use strict\";/img, ''))
    .pipe(replace(/^\}\)\(\);/img, ''))
    .pipe(concat("chocolatechip-" + pkg.version + ".js"))
    .pipe(header(chuijs_start))
    .pipe(footer(chuijs_end))
    .pipe(header(chocolatechipjsHeader, { pkg : pkg, chuiName: pkg.title }))
    .pipe(replace(/VERSION_NUMBER/img, '\"' + version + '\"'))
    .pipe(gulp.dest(pkg.projectPath + './dist/'))
    .pipe(uglify())
    .pipe(header(chocolatechipjsHeaderMin, { pkg : pkg, chuiName: pkg.title }))
    .pipe(rename("chocolatechip-" + pkg.version + ".min.js"))
    .pipe(gulp.dest(pkg.projectPath + './dist/'));

  gulp.src(["src/typings/*"])
    .pipe(gulp.dest(pkg.projectPath + './dist/typings'));
  gulp.src(["src/typings/*/**"])
    .pipe(gulp.dest(pkg.projectPath + './dist/typings'));

});


// JSHint:
gulp.task('jshint', function() {
  gulp.src("dist/chocolatechip-" + pkg.version + ".js")
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
      "-W083": false  
    }))
    .pipe(jshint.reporter('default'));
});

// Create Tests:
gulp.task('tests', function() {
  gulp.src('src/tests/qunit/*')
    .pipe(gulp.dest('tests/qunit'));

  gulp.src('src/tests/chocolatechip/*.js')
    .pipe(gulp.dest('tests/chocolatechip'));

  gulp.src('src/tests/chocolatechip/*.html')
    .pipe(header(testHeader, {pkg: pkg}))
    .pipe(gulp.dest('tests/chocolatechip'))

  gulp.src('src/forms/*')
    .pipe(gulp.dest('forms/'));

  setTimeout(function() {
    if (gutils.env.deferredSupport) {
      del(['tests/chocolatechip/promises-tests.html', 'tests/chocolatechip/promises-tests.js']);
    } else {
      del(['tests/chocolatechip/deferred-tests.html', 'tests/chocolatechip/deferred-tests.js']);
    }

  }, 2000);
});

/* 
   Define default task:
   To build, just enter gulp in terminal.
*/
gulp.task('default', ['js', 'jshint', 'tests']);
