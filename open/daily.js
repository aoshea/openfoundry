'use strict';

let request = require('request'),
    fs      = require('fs'),
    cheerio = require('cheerio'),
    path     = require('path')
    ;

const sourceUrl = 'http://www.dailymail.co.uk/tvshowbiz/headlines/index.html';

let dirs = {
  out: __dirname + '/build/',
};

function getHeadlines() {
  return new Promise(function (resolve, reject) {
    request(sourceUrl, function (err, res, html) {
      if (err) {
        reject(err);
        return;
      }
      let $ = cheerio.load(html);
      resolve($('span.headline').map((i, val) => JSON.stringify($(val).first().text())));
    });
  });
}

function writeJSON(data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path.join(dirs.out, 'headlines.json'), JSON.stringify(data, null, 2), function (err, res) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

getHeadlines()
  .then(function (list) {

    writeJSON(list[0])
      .then(function (res) {
        console.log('json did write', res);
      })
      .catch(function (err) {
        console.error('error:json didnt write', err);
      });
  })
  .catch(function (err) {
    console.error('Error: getHeadlines', err);
  });