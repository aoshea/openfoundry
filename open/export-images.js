'use strict';

var fs    = require('fs'),
    path  = require('path')
    ;
    
var dirs = {
  src: __dirname + '/images',
  out: __dirname + '/data',
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

function listImages(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, list) {
      console.log('list', list);
      if (err) {
        reject(err);
      } else {
        resolve(list.map(function (o) {
          return path.join(dir, o);
        }));
      }
    });
  });
}

function outputJSON(result) {
  mkdirSync(path.join(dirs.out));
  fs.writeFile(path.join(dirs.out, 'backgrounds.json'), "window.siteJSON = " + JSON.stringify(result, null, 2), function (err){
    if (err) return console.warn('Error: Write file:', err);
    return console.log('Complete');
  });
}

listImages(dirs.src).then(function (list) {
  console.log('list', list);
  outputJSON(list);
}).catch(function (err) {
  console.warn('Error:', err);
})
