var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    gutil       = require('gulp-util'),
    autoprefix  = require('gulp-autoprefixer'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    changed     = require('gulp-changed'),
    livereload  = require('gulp-livereload'),
    notify      = require('gulp-notify'),
    concat      = require('gulp-concat'),
    gulpif      = require('gulp-if'),
    sass        = require('gulp-sass'),
    minifycss   = require('gulp-minify-css'),
    del         = require('del'),
    argv        = require('yargs').argv
    ;

/**
 * Production flag 
 * @usage `gulp --production`
 */
var production = !!argv.production;

/**
 * Error handling  
 */
var onError = function (task) {
  return function (err) {

    notify.onError({
      message: task + ' failed'
    })(err);

    gutil.log( gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err) );
  };
};

// Define folders and files 
var dir = {
  source: 'src/',
  build: 'dist/'
};

var sources = {
  app:     [ dir.source + 'assets/js/index.js'],
  js:      [ dir.source + 'assets/js/**/*.js' ],
  imgs:    [ dir.source + 'assets/img/*'],
  fonts:   [ dir.source + 'assets/fonts/**'],
  css:     [ dir.source + 'assets/css/main.scss'],
  allcss:  [ dir.source + 'assets/css/**/*.scss']
};

// Default task `gulp`
gulp.task('default', ['images', 'css', 'js', 'watch']);

// Browserify & babelify & uglify 
gulp.task('js', function () {
  var b = browserify({
    entries: sources.app,
    debug: true,
    transform: [babelify]
  });

  return b.bundle()
    .on('error', function (err) { console.log('Error:', err.message); })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

/**
 * Process SASS
 * Generate source maps 
 * Add vendor prefixes - autoprefix 
 * Combines to one file `style.css`
 * @usage `gulp css`
 */
gulp.task('css', function () {

  return gulp.src(sources.css)
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix())
    .pipe(concat('main.css'))
    .pipe(gulpif(production, minifycss()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.build + 'css'))
    .pipe(livereload());
});

// Copy image files to build folder 
gulp.task('images', function () {
  return gulp.src(sources.imgs)
    .pipe(gulp.dest(dir.build));
});

// Clean build folder 
gulp.task('clean', function () {
  del(dir.build + '**');
});

// Watch for the changes
gulp.task('watch', function () {

  livereload.listen();
  gulp.watch(sources.imgs, ['images']);
  gulp.watch(sources.allcss, ['css']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(dir.build + '**/*').on('change', livereload.changed);
});

