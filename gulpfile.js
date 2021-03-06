var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    bump        = require('gulp-bump'),
    connect     = require('gulp-connect'),
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
    reload      = browsersync.reload,
    replace     = require('gulp-replace'),
    rsync       = require('gulp-rsync'),
    tag_version = require('gulp-tag-version'),
    watchify    = require('watchify'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant')
    ;

/**
 * Production flag
 * @usage `gulp --production`
 */
var production = !!argv.production;

if (production) {
  process.env.NODE_ENV = 'production';
}

process.env.OF_WEINRE = argv.weinre;
process.env.OF_DEBUG = argv.debug;

var packageJSON = require('./package.json');

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

/**
 * Rsync config
 */
var config = {
  rsync: {
    src: dir.build + '**',
    live: require('./config/production.json'),
    staging: require('./config/staging.json')
  }
};

gulp.task('launch-prototype', function() {
  connect.server({
    root: ['prototype']
  });
});

const rsyncBuild = (target) => {
  try {
    const options = require(`./config/${target}.json`);
    return gulp.src(config.rsync.src)
      .pipe(rsync(options.rsync.options));

  } catch (e) {
    gutil.log(gutil.colors.bgRed(`Deploy to ${target} failed:`), gutil.colors.red(e));
  }
};

/**
 * Rsync files to live server
 */
gulp.task('deploy-live', function () {
  return rsyncBuild('production');
});

/**
 * Rsync files to staging server
 */
gulp.task('deploy-staging', function () {
  return rsyncBuild('staging');
});

var sources = {
  tpl:         [ dir.source + 'tpl/**/*'],
  index:       [ dir.source + 'index.js'],
  app:         [ dir.source + 'public/js/index.js'],
  js:          [ dir.source + 'public/js/**/*.js' ],
  imgs:        [ dir.source + 'public/img/*'],
  html:        [ dir.source + 'public/html/*'],
  fonts:       [ dir.source + 'public/fonts/**'],
  css:         [ dir.source + 'public/css/main.scss'],
  allcss:      [ dir.source + 'public/css/**/*.scss'],
  export:      [ dir.data + '**/*' ],
  backgrounds: [ dir.backgrounds +'**/*' ],
  includes:    [ dir.source + 'inc/**/*' ], // serverside includes
  vendorjs:    [ dir.source + 'public/vendor-js/**/*' ]
};

/**
 * Define static libs for js bundle
 */
var libs = [
  "jquery",
  "react",
  "react-dom",
  "react-router",
  "react-helmet",
  "react-addons-transition-group",
  "react-addons-css-transition-group",
  "react-linkify",
  "react-addons-pure-render-mixin",
  "react-addons-perf"
];

/**
 * Create vendor bundle for static js libs
 * To avoid recompiling everything all the time
 * @see https://github.com/sogko/gulp-recipes/tree/master/browserify-separating-app-and-vendor-bundles
 */
gulp.task('vendor-js', function () {

  var global_entries = [
    require.resolve("babel-polyfill"),
    // require.resolve('babel-plugin-syntax-object-rest-spread'),
    // './src/public/vendor-js/modernizr.js',
    './src/public/vendor-js/stepform.js'
  ];

  var b = browserify({
    debug: !production,
    entries: global_entries,
    //transform: [babelify.configure({
      //presets: ["es2015", "react", "stage-2"],
      // plugins: ["transform-object-rest-spread"]
    // })]
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
gulp.task('js', bundle);

function bundle() {

  return getBrowserifyBundler().bundle()
    .on('error', onError('app-js', this.emit, this))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.build + 'public/js'))
    .pipe(reload({stream:true}))
}

var watchifyBundler;

function getBrowserifyBundler() {

    // only creates the watchifyBundler once
    if ('undefined' === typeof watchifyBundler) {

      var bfy = browserify({
        entries: sources.app,
        debug: !production,
        cache: {},
        packageCache: {},
        paths: ['./src/public/js/'],
        fullPaths: false,
        transform: [babelify.configure({
          presets: ["es2015", "react", "stage-2"]
        })]
      });

      // let browserify know we will libs from an external source
      // vendor.js in this case
      libs.forEach(function (lib) {
        bfy.external(lib);
      });

      watchifyBundler = watchify(bfy, {
        delay: 25,
        ignoreWatch: ['**/node_modules/**'],
        // poll: false
      });
    }

    return watchifyBundler;

};

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
    .pipe(sourcemaps.write('./', { includeContent: false }))
    .pipe(gulp.dest(dir.build + 'public/css'))
    .pipe(reload({stream:true, match: '**/*.css'}));
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

// Bumps the current version and creates a tag for Git
// gulp bump --patch for 0.0.1 --> 0.0.2
// gulp bump --minor (default) 0.1.0 --> 0.2.0
// gulp bump --major for 1.0.0 -> 2.0.0
gulp.task('bump', function(){
  var type = 'minor'; // default type
  type = !!argv.patch ? 'patch' : type;
  type = !!argv.major ? 'major' : type;
  return gulp.src('./package.json')
    .pipe(bump({type: type }))
    .pipe(gulp.dest('./'))
    .pipe(tag_version())
});


gulp.task('build-export', function (cb) {
  exec('node open/export.js && node open/specimen.js && node open/spreadsheet.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) cb(err);
  });
});

// Copy exported json and fonts over
gulp.task('copy-fonts', function () {
  return gulp.src(sources.export)
    .pipe(gulp.dest(dir.build + 'public/data'));
});

// Copy exported images over
gulp.task('copy-images', function () {
  return gulp.src(sources.backgrounds)
    .pipe(gulp.dest(dir.build + 'public/data/backgrounds'));
});

gulp.task('copy', ['copy-fonts', 'copy-images']);

gulp.task('export', ['build-export']);

// Clean build folder
gulp.task('clean', function () {
  del(dir.build + '**');
});

// Copy jade templates to destination folder
gulp.task('templates', function () {
  return gulp.src(sources.tpl)
    .pipe(replace(/__VERSION__/g, packageJSON.version))
    .pipe(gulp.dest(dir.build + 'tpl/'));
});

// Copy index.js over
gulp.task('index', ['templates'], function () {
  return gulp.src(sources.index)
    .pipe(gulp.dest(dir.build));
});

// Copy includes over
gulp.task('includes', function () {
  return gulp.src(sources.includes)
    .pipe(gulp.dest(dir.build + '/inc'));
});

// Copy includes over
gulp.task('copy-vendor-js', function () {
  return gulp.src(sources.vendorjs)
    .pipe(gulp.dest(dir.build + '/public/js/vendor/'));
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
  var mode = production ? 'production' : 'development';

  return nodemon({
    script: dir.build + 'index.js',
    env: { 'NODE_ENV': mode }
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

// Start BrowserSync
gulp.task('browser-sync', function () {
  // NOTE: the client-side snipped has been added
  // manually in index.jade, it seems to be too
  // complicated to hook up nodemon etc.
  return browsersync.init({})
});

// Watch for the changes
gulp.task('watch', ['browser-sync'], function () {

  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.imgs, ['images']);
  gulp.watch(sources.allcss, ['css']);
  gulp.watch(sources.js, ['lint']);
  getBrowserifyBundler().on('update', bundle);
  gulp.watch(sources.index, ['index']);
  gulp.watch(sources.tpl, ['templates']);

  // FIXME: leaving this out since JS is handled by watchify
  //        however it might be a better solution to just
  //        ignore 'js/map' etc.

  // gulp.watch(dir.build + '**/*').on('change', reload);
});

// Default task `gulp`
gulp.task('build', ['index', 'includes', 'html', 'images', 'css', 'vendor-js', 'js', 'copy-vendor-js', 'watch']);
gulp.task('default', ['db', 'server']);
