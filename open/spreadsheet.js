'use strict';

var Tabletop = require('tabletop'),
    fs       = require('fs'),
    path     = require('path'),
    request  = require('request'),
    cheerio  = require('cheerio')
    ;

var dirs = {
  out: __dirname + '/build/',
};

const sourceUrl = 'http://www.dailymail.co.uk/tvshowbiz/headlines/index.html';
const sourceSelector = 'span.headline';

function getHeadlines() {
  return new Promise(function (resolve, reject) {
    request(sourceUrl, function (err, res, html) {
      if (err) {
        reject(err);
        return;
      }
      let $ = cheerio.load(html);
      resolve( $(sourceSelector).map( (i, val) => $(val).first().text() ) );
    });
  });
}

function sortHeadlines(headlines) {

  var temp = Object.keys(headlines).map(function (key) {
    return headlines[key];
  });
  
  return temp.filter( (el, i, arr) => el.length > 85 && el.length < 130 );
}

function getSheet() {
  return new Promise(function (resolve, reject) {
    var options = {
      // Set Google Sheets key for Tabletop.js
      key: 'https://docs.google.com/spreadsheets/d/155IMLrVayr863mCW9C7dwc-gqiMmRG59UdwoBqnoDFw/pubhtml',
      // Set callback to resolve data
      callback: function (data, Tabletop) {
        if (data['Sheet1']) {
          var sheet = data['Sheet1'];
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
  getHeadlines().then(function(headlines) {

    // Sort by char len
    let filteredHeadlines = sortHeadlines(headlines);

    // Override json settings text
    res.map(function (v, i) {
      if (i < filteredHeadlines.length && filteredHeadlines[i]) {
        v['settings-text'] = filteredHeadlines[i];
      }
    });

    // Write file
    writeJSON(res).then(function () {
      console.log('Write file sheet.json');
    });

  });
});
