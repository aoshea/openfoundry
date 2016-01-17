var gulp = require('gulp')
var watch = require('gulp-watch')
var livereload = require('gulp-livereload')
var sass = require('gulp-sass')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var collapse = require('bundle-collapser/plugin')
var uglify = require('gulp-uglify')
var modernizr = require('gulp-modernizr')
var supervisor = require('gulp-supervisor')

gulp.task('default', ['watch', 'supervisor'])

function styles() {

  gulp.src('styles/main.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(livereload())

}

function scripts() {

  try {
    browserify(['./scripts/main.js'], {debug: true, fullPaths: true})
    .transform(babelify)
    .plugin(collapse)
    .bundle()
    .on('error', function(err) {
      console.log(err.message)
      this.end()
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('public/js/'))
    .pipe(livereload())

  }catch (error) {
    console.log(error)
  }

}

gulp.task('watch', function() {

  livereload.listen()

  // styles
  gulp.watch('./styles/*.scss', styles)

  // scripts
  gulp.watch(['./scripts/*.js'], scripts)

})// watch


gulp.task('modernizr', function() {

  gulp.src('scripts/*.js')
    .pipe(modernizr({
      /*'extra' : {
        'shiv' : true,
        'printshiv' : false,
        'load' : false,
        'mq' : false,
        'cssclasses' : true
      },
*/
      'options' : [
        'setClasses'
      ],

      'extensibility' : {
        'addtest' : false,
        'prefixed' : true,
        'teststyles' : false,
        'testprops' : false,
        'testallprops' : false,
        'hasevents' : false,
        'prefixes' : true,
        'domprefixes' : true
      },

      // When parseFiles = true, matchCommunityTests = true will attempt to
      // match user-contributed tests.
      'matchCommunityTests' : true,

      // Have custom Modernizr tests? Add paths to their location here.
      'customTests' : [],
      // By default, this task will crawl your project for references to Modernizr tests.
      // Set to false to disable.
      'parseFiles' : false,
      'uglify' : false,
      // Define any tests you want to implicitly include.
      'tests' : ['touchevents', 'csstransforms', 'csstransitions', 'csstransforms3d', 'prefixed']
      //excludeTests: ['csstransforms3d']
    }))

    .pipe(rename('modernizr.custom.js'))
    .pipe(gulp.dest('public/js/'))
})

gulp.task('supervisor', function () {
  supervisor('app.js')
})