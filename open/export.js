'use strict';

var fs    = require('fs'),
    path  = require('path')
    ;
    
var dirs = {
  src: __dirname + '/fonts',
  out: __dirname + '/build/backgrounds',
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

var output = {};

function getConfig(file) {
  return new Promise(function (resolve, reject) { 
    fs.exists(file, function (exists) {
      if (!exists) {
        reject('Missing "config.json" in ' + path.basename(file) + '/');
        return;
      }
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) reject(err);
        try {
          var json = JSON.parse(data);
          resolve(json);
        } catch(e) {
          console.warn("Error: JSON parse", e, file);
          reject(e);
        }    
      });
    })
  });
}

function getSources(list) { 
  
  return list.map(function (o) {
    var n = path.basename(o), fontdir = 'fonts';
    mkdirSync(path.join(dirs.out, fontdir));
    copyFile(o, path.join(dirs.out, fontdir, n), function () {
      console.warn('Error: Copy file', o);
    });
    return path.join(fontdir, path.basename(o));
  });  
}

function getFonts(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, list) {
      if (err) reject(err);
      else resolve(list);
    });
  }).then(function (list) {    
    return getSources(list.map(function(o) {
      return path.join(dir, o);
    }).filter(function (o) {
      return o.match(/\.(woff|ttf|svg|eot|woff2)$/);
    }));        
  }).catch(function (err) {
    console.warn('Error: Listing font sources', err);
  });
}

function listContents(dir) {
  return Promise.all([
    getConfig(path.join(dir, 'config.json')),
    getFonts(path.join(dir, 'fonts'))
  ]).then(function (list) {
    return list;
  }).catch(function (err) {
    console.warn('Error: Listing contents', err.stack);
  });
}

function listFonts(dir) {
  return new Promise(function (resolve, reject) {    
    fs.readdir(dir, function (err, list) {
      if (err) {
        reject(err);
      } else {
        resolve(list.map(function (o) {
          return path.join(dir, o);
        }).filter(function (o) {
          var stats = fs.statSync(o);
          return !o.match(/^\./) && stats.isDirectory();
        }));
      }      
    });    
  });  
}

function getFontFormat(str) {
  var res = str.match(/\.(woff|ttf|svg|eot|woff2)$/);
  if (res) {
    if (res[1] === 'eot') res[1] = 'eot?';
    return res[1].toString();
  } else {
    return 'Unknown';
  }
}

function getFontSource(srcs) {
  var str = srcs.map(function (x) {
    return "url('" + x + "') format('" + getFontFormat(x) + "'),";
  }).join('');
  return str.substr(0, str.length-1);
}

function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_';
  return str.replace(/[^a-z0-9\.]/gim, replacement);
}

function outputCSS(result) {
  var ret = '', fontFamily;
  result.filter(function (o) {
    fontFamily = o[0].name;    
    o.filter(Array.isArray).map(function (x) {
      ret += "@font-face {\n";
      ret += "\tfont-family: '" + fontFamily + "';\n";
      ret += "\tsrc: " + getFontSource(x) + ";";
      ret += "\n}\n";
      
      ret += "." + replaceNonAlphaNumeric(fontFamily).toLowerCase() + " {\n";
      ret += "\tfont-family: '" + fontFamily + "';\n";
      ret += "}\n";
      
    });
  });
  fs.writeFile(path.join(dirs.out, 'fonts.css'), ret, function (err) {
    if (err) return console.error('Error: Write file:', err);
    return console.log('Write CSS Complete');
  });
}

function outputJSON(result) {
  mkdirSync(path.join(dirs.out));
  fs.writeFile(path.join(dirs.out, 'site.json'), "window.backgroundsJSON = " + JSON.stringify(result, null, 2), function (err){
    if (err) return console.warn('Error: Write file:', err);
    return console.log('Complete');
  });
}

listFonts(dirs.src).then(function (list) {
  return Promise.all(list.map(listContents));
}).then(function (result) {
  outputJSON(result);
  outputCSS(result);
}).catch(function (err) {
  console.warn('END: Error...:', err);
});