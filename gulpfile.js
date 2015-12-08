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
  data: 'open/build/',
  backgrounds: 'open/images/',
  source: 'src/',
  build: 'dist/'
};

var sources = {
  app:         [ dir.source + 'assets/js/index.js'],
  js:          [ dir.source + 'assets/js/**/*.js' ],
  imgs:        [ dir.source + 'assets/img/*'],
  html:        [ dir.source + 'assets/html/*'],
  fonts:       [ dir.source + 'assets/fonts/**'],
  css:         [ dir.source + 'assets/css/main.scss'],
  allcss:      [ dir.source + 'assets/css/**/*.scss'],
  export:      [ dir.data + '**/*' ],
  backgrounds: [ dir.backgrounds +'**/*' ]
};

/**
 * Define static libs for js bundle 
 */
var libs = [
  "react"
];

/**
 * Create vendor bundle for static js libs 
 * To avoid recompiling everything all the time 
 * @see https://github.com/sogko/gulp-recipes/tree/master/browserify-separating-app-and-vendor-bundles
 */
gulp.task('vendor-js', function () {
  
  var b = browserify({
    debug: !production,
    transform: [babelify.configure({
      presets: ["es2015", "react"]
    })]
  });

  libs.forEach(function(lib) {
    b.require(lib);
  });

  return b.bundle()
    .on('error', onError('vendor-js'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest(dir.build + 'assets/js'));
});

// Browserify & babelify & uglify 
gulp.task('js', function () {
  
  var b = browserify({
    entries: sources.app,
    debug: !production,
    transform: [babelify.configure({
      presets: ["es2015", "react"]
    })]
  });
  
  // let browserify know we will libs from an external source
  // vendor.js in this case
  libs.forEach(function (lib) {
    b.external(lib);
  });
  
  return b.bundle()
    .on('error', onError('app-js'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.build + 'assets/js'));
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
    .pipe(gulp.dest(dir.build + 'assets/css'))
    .pipe(livereload());
});

// Copy html files to build folder 
gulp.task('html', function () {
  return gulp.src(sources.html)
    .pipe(gulp.dest(dir.build));
});

// Copy image files to build folder 
gulp.task('images', function () {
  return gulp.src(sources.imgs)
    .pipe(gulp.dest(dir.build + 'assets/img'));
});

// Copy exported json and fonts over 
gulp.task('export-json', function () {
  return gulp.src(sources.export)
    .pipe(gulp.dest(dir.build + 'data'));
});
gulp.task('export-images', function () {
  return gulp.src(sources.backgrounds)
    .pipe(gulp.dest(dir.build + 'data/backgrounds'));
});

gulp.task('export', ['export-json', 'export-images']);

// Clean build folder 
gulp.task('clean', function () {
  del(dir.build + '**');
});

// Watch for the changes
gulp.task('watch', function () {

  livereload.listen();
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.imgs, ['images']);
  gulp.watch(sources.allcss, ['css']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(dir.build + '**/*').on('change', livereload.changed);
});

// Default task `gulp`
gulp.task('default', ['html', 'images', 'css', 'vendor-js', 'js', 'watch']);


