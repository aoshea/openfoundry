var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    eslint      = require('gulp-eslint'),
    gutil       = require('gulp-util'),
    autoprefix  = require('gulp-autoprefixer'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    changed     = require('gulp-changed'),
    notify      = require('gulp-notify'),
    concat      = require('gulp-concat'),
    gulpif      = require('gulp-if'),
    sass        = require('gulp-sass'),
    nano        = require('gulp-cssnano'),
    del         = require('del'),
    exec        = require('child_process').exec,
    argv        = require('yargs').argv,
    osenv       = require('osenv'),
    nodemon     = require('gulp-nodemon'),
    browsersync = require('browser-sync'),
    reload      = browsersync.reload
    ;

/**
 * Production flag
 * @usage `gulp --production`
 */
var production = !!argv.production;

/**
 * Error handling
 */
var onError = function (task, emit, context) {

  return function (err) {

    notify.onError({
      message: task + ' failed'
    })(err);

    gutil.log( gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err) );

    if (emit && context) emit.call(context, 'end');
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
  tpl:         [ dir.source + 'tpl/**/*'],
  index:       [ dir.source + 'index.js'],
  app:         [ dir.source + 'public/js/app.js'],
  js:          [ dir.source + 'public/js/**/*.js' ],
  imgs:        [ dir.source + 'public/img/*'],
  html:        [ dir.source + 'public/html/*'],
  fonts:       [ dir.source + 'public/fonts/**'],
  css:         [ dir.source + 'public/css/main.scss'],
  allcss:      [ dir.source + 'public/css/**/*.scss'],
  export:      [ dir.data + '**/*' ],
  backgrounds: [ dir.backgrounds +'**/*' ]
};

/**
 * Define static libs for js bundle
 */
var libs = [
  "react",
  "react-dom",
  "jquery"
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
    .pipe(gulp.dest(dir.build + 'public/js'));
});

/**
 * Process javascript
 * Lint with `gulp-eslint`
 * @usage `gulp lint`
 */
gulp.task('lint', function () {

  return gulp.src(sources.js)
    .pipe(eslint())
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
    .on('error', onError);
});

// Browserify & babelify & uglify
gulp.task('js', ['lint'], function () {

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
    .on('error', onError('app-js', this.emit, this))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.build + 'public/js'));
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
    .pipe(gulpif(production, nano()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.build + 'public/css'))
    .pipe(reload({stream:true}));
});

// Copy html files to build folder
gulp.task('html', function () {
  return gulp.src(sources.html)
    .pipe(gulp.dest(dir.build + 'public'));
});

// Copy image files to build folder
gulp.task('images', function () {
  return gulp.src(sources.imgs)
    .pipe(gulp.dest(dir.build + 'public/img'));
});


gulp.task('build-specimens', function (cb) {
  exec('node open/specimen.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) cb(err);
  });
});
gulp.task('build-fonts', function (cb) {
  exec('node open/export.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) cb(err);
  });
});
// Copy exported json and fonts over
gulp.task('export-fonts', ['build-specimens', 'build-fonts'], function () {
  return gulp.src(sources.export)
    .pipe(gulp.dest(dir.build + 'public/data'));
});

// Copy exported images over
gulp.task('export-images', function () {
  return gulp.src(sources.backgrounds)
    .pipe(gulp.dest(dir.build + 'public/data/backgrounds'));
});

gulp.task('export', ['export-fonts', 'export-images']);

// Clean build folder
gulp.task('clean', function () {
  del(dir.build + '**');
});

// Copy jade templates to destination folder
gulp.task('templates', function () {
  return gulp.src(sources.tpl)
    .pipe(gulp.dest(dir.build + 'tpl/'));
});

// Copy index.js over
gulp.task('index', ['templates'], function () {
  return gulp.src(sources.index)
    .pipe(gulp.dest(dir.build));
});

// Start database
gulp.task('db', function () {
  var dbpath = osenv.home() + '/datadb';
  exec('mongod -dbpath ' + dbpath, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// Run express with nodemon
gulp.task('server', ['build'], function () {
  var started = false;
  return nodemon({
    script: dir.build + 'index.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

// Start BrowserSync
gulp.task('browser-sync', ['nodemon'], function () {
  browsersync.init(null, {
    proxy: {
      host: 'http://localhost',
      port: 7777
    }
  });
});

// Watch for the changes
gulp.task('watch', function () {

  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.imgs, ['images']);
  gulp.watch(sources.allcss, ['css']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.index, ['index']);
  gulp.watch(sources.tpl, ['templates']);

  gulp.watch(dir.build + '**/*').on('change', reload);
});

// Default task `gulp`
gulp.task('build', ['index', 'html', 'images', 'css', 'vendor-js', 'js', 'watch']);
gulp.task('default', ['db', 'server']);


