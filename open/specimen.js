'use strict';

var sizeOf = require('image-size'),
    fs     = require('fs'),
    path   = require('path')
    ;

var dirs = {
  src: __dirname + '/fonts',
  out: __dirname + '/build/',
};

function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_';
  return str.replace(/[^a-z0-9\.]/gim, replacement);
}

/**
 * Create directory if it doesnt exist
 */
var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if (e.code != 'EEXIST') throw e;
  }
};

/**
 * Copy file with error handling
 */
function copyFile(src, target, callback) {
  var isCallback, rd, wr;

  rd = fs.createReadStream(src);
  rd.on('error', done);
  wr = fs.createWriteStream(target);
  wr.on('error', done);
  rd.pipe(wr);

  function done(err) {
    if (!isCallback) {
      callback(err);
      isCallback = true;
    }
  }
}

/**
 * Copy specimen images to build folder
 */
function copySpecimens(list) {
  var targetDir = 'specimens';

  return list.map(function (o) {

    var p = o.path;

    var base = path.basename(p);

    // Create directory if not exist
    mkdirSync(path.join(dirs.out, targetDir));

    // Copy file to target dir
    copyFile(p, path.join(dirs.out, targetDir, base), function () {
    });

    var dim = sizeOf(p);

    return {
      id: o.id,
      path: path.basename(p),
      width: dim.width,
      height: dim.height,
      value: o.value
    };
  });
}

/**
 * Copy specimen images to build folder
 */
function copyPreviews(list) {
  var targetDir = 'specimens';

  return list.map(function (o) {

    var p = o;

    var base = path.basename(p);

    // Create directory if not exist
    mkdirSync(path.join(dirs.out, targetDir));

    // Copy file to target dir
    copyFile(p, path.join(dirs.out, targetDir, base), function () {
      console.log('copy ?', p);
    });
  });
}

/**
 * Copy over all specimen pages
 */
function getPreviewSpecimens(dir) {
  return new Promise(function (resolve, reject) {

    fs.readdir(dir, function (err, list) {
      if (err) reject(err);
      else resolve(list.map(function (o) {
        return o;
      }).filter(function (o) {
        // get preview images
        return o.match(/preview\.(jpg|png|gif|svg)$/);
      }));
    })
  }).then(function (list) {

    copyPreviews(list);

  }).catch(function (err) {
    console.error('Error: Listing preview specimens', err);
    reject(err);
  });
}

/**
 * List contents of font folder
 */
function listContents(obj) {

  var id = obj.id;
  var dir = obj.path;

  // getPreviewSpecimens(dir);

  return new Promise(function (resolve, reject) {

    fs.readdir(dir, function (err, list) {
      if (err) reject(err);
      else resolve(list.map(function (o) {
        return o;
      }).filter(function (o) {

        // skip preview version of image
        if (o.match(/preview/)) {
          return false;
        }

        return o.match(/\.(jpg|png|gif|svg)$/);
      }));
    });
  }).then(function (list) {

    // Copy to build and get dimensions
    var ret = copySpecimens(list.map(function (o) {
      return {
        id: id,
        path: path.join(dir, o),
        value: o
      };
    })).filter(function (o) {
      return o.path.match(/\.(jpg|png|gif|svg)$/);
    });

    // Return with id
    return ret;

  }).catch(function (err) {
    console.error('Error: Listing specimens', err);
  });
}

function listFontSpecimens(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, list) {
      if (err) {
        reject(err);
      } else {
        resolve(list.map(function (o) {
          return {
            id: o,
            path: path.join(dir, o)
          };
        }).filter(function (o) {
          var stats = fs.statSync(o.path);
          return !o.path.match(/^\./) && stats.isDirectory();
        }));
      }
    });
  });
}

function outputCSS(result) {

  var ret = '';

  result.map(function (o) {

    if (o.length < 1) return;

    var specimen = o[0];

    var id = replaceNonAlphaNumeric(specimen.id).toLowerCase();

    var className = 'specimen-' + id;
    var imageUrl = 'specimens/' + specimen.value;

    var ratio = ((specimen.height / specimen.width) * 100) + '%';
    var ratioClassName = 'ratio-' + id;

    ret += "." + className + ' { ' + "background-image: url(" + imageUrl + "); } \n";
    ret += "." + ratioClassName + " { padding-bottom: " + ratio + " }\n";
  });

  fs.writeFile(path.join(dirs.out, 'specimen.css'), ret, function (err) {
    if (err) return console.error('Error: Write CSS file: ' + err);
    else return console.log('Write specimen CSS complete');
  });
}

listFontSpecimens(dirs.src).then(function (res) {
  return Promise.all(res.map(listContents));
}).then(function (res) {
  outputCSS(res);
});