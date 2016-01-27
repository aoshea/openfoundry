'use strict';

var fs    = require('fs'),
    path  = require('path')
    ;

var dirs = {
  src: __dirname + '/fonts',
  out: __dirname + '/build/',
};

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

/*
function getFonts(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, list) {
      if (err) reject(err);
      else resolve(list);
    });
  }).then(function (list) {
    return copyFontSources(list.map(function(o) {
      return path.join(dir, o);
    }).filter(function (o) {
      return o.match(/\.(otf|woff|ttf|svg|eot|woff2)$/);
    }));
  }).catch(function (err) {
    console.warn('Error: Listing font sources', err);
  });
}
*/

function copySpecimens(list) {
  var targetDir = 'specimens';

  return list.map(function (o) {

    var base = path.basename(o);

    // Create directory if not exist
    mkdirSync(path.join(dirs.out, targetDir));

    // Copy file to target dir
    copyFile(o, path.join(dirs.out, targetDir, base), function () {
      console.log('copy callback');
    });
    return path.join(base);
  });
}

function listContents(obj) {

  var dir = obj.path;

  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, list) {
      if (err) reject(err);
      else resolve(list.map(function (o) {
        return o;
      }).filter(function (o) {
        return o.match(/\.(jpg|png|gif|svg)$/);
      }));
    });
  }).then(function (list) {
    // Copy to build
    return copySpecimens(list.map(function (o) {
      return path.join(dir, o);
    })).filter(function (o) {
      return o.match(/\.(jpg|png|gif|svg)$/);
    });
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
            path: path.join(dir, o)
          };
          /*
          return {
            id: o,
            path: path.join(dir, o)
          };
          */
        }).filter(function (o) {
          // return o.match(/\.(jpg|png|gif|svg)$/);
          var stats = fs.statSync(o.path);
          return !o.path.match(/^\./) && stats.isDirectory();
        }));
      }
    });
  });
}

listFontSpecimens(dirs.src).then(function (res) {

  return Promise.all(res.map(listContents));

}).then(function (res) {
  console.log('res', res);
});