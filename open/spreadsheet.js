'use strict';

var Tabletop = require('tabletop'),
    fs       = require('fs'),
    path     = require('path')
    ;

var dirs = {
  out: __dirname + '/build/',
};

var cache = {};

function getSheet() {
  return new Promise(function (resolve, reject) {
    var options = {
      // Set Google Sheets key for Tabletop.js
      key: 'https://docs.google.com/spreadsheets/d/155IMLrVayr863mCW9C7dwc-gqiMmRG59UdwoBqnoDFw/pubhtml',
      // Set callback to resolve data
      callback: function (data, Tabletop) {
        if (data['Sheet1']) {
          var sheet = data['Sheet1'];
          cache.fonts = sheet.all();
          return resolve(sheet.all());
        } else {
          return reject(data);
        }
      }
    };
    Tabletop.init(options);
  });
}

function writeJSON(data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path.join(dirs.out, 'sheet.json'), JSON.stringify(data, null, 2), function (err, res) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

getSheet().then(function (res) {
  writeJSON(res).then(function () {
    console.log('Write file sheet.json');
  });
});
