'use strict';

var Tabletop = require('tabletop'),
    fs       = require('fs'),
    path     = require('path'),
    request  = require('request'),
    cheerio  = require('cheerio'),
    sizeOf   = require('image-size'),
    async    = require('async')
    ;

var dirs = {
  out: __dirname + '/build/',
};

const sourceUrl = 'http://www.dailymail.co.uk/sciencetech/index.html';
const sourceSelector = 'h2.linkro-darkred a'; // span.headline

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

function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_';
  return str.replace(/[^a-z0-9\.]/gim, replacement);
}

function camelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function parseFontData(data) {

  const fonts = data.map(font => {

    font['id'] = replaceNonAlphaNumeric(font['font-id']).toLowerCase();
    font['settings-font-size'] = parseInt(font['settings-font-size'], 10);
    font['settings-line-height'] = parseFloat(font['settings-line-height'], 10);
    font['settings-letter-spacing'] = parseFloat(font['settings-letter-spacing'], 10);
    font['settings-letter-spacing-min'] = parseFloat(font['settings-letter-spacing-min'], 10);

    Object.keys(font).map(fontKey => {
      const camelKey = camelCase(fontKey);
      const keyValue = font[fontKey];
      font[camelKey] = keyValue;
      if (camelKey !== fontKey) delete font[fontKey];
    });

    return font;
  });

  return { fonts };
}


const getSpecimens = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, 'build', 'specimens'), (err, res) => {
      if (err) return reject(err)
      console.log(res)
      return resolve(res)
    })
  })
}

const createSizeCb = (imagePath) => (cb) => {

  let p = path.join(__dirname, 'build', 'specimens', imagePath)

  sizeOf(p, (err, dimensions) => {
    if (err) return cb(err)
    console.log(imagePath, dimensions.width, dimensions.height);
    const specimenImage = {
      src: imagePath,
      width: dimensions.width,
      height: dimensions.height
    }
    return cb(null, specimenImage)
  });
}

const getImageDimensions = (specimens) => {

  return new Promise((resolve, reject) => {

    const cbs = specimens.map(createSizeCb)

    async.parallel(cbs, (err, specimenImages) => {
      if (err) return reject(err)
      return resolve(specimenImages)
    })
  })
}

const addSpecimensToFonts = (data, specimenImages) => {
  const fonts = data.fonts
  const re = /\.(svg|png|jpg|gif)$/g
  const dashRe = /-/g

  return specimenImages.map(specimen => {

    const fontId = specimen.src
      .replace('specimen-', '')
      .replace(dashRe, '_')
      .replace(re, '')

    fonts.map(f => {
      if (f.id === fontId) {
        f['specimenImage'] = `/data/specimens/${specimen.src}`
        f['specimenWidth'] = specimen.width
        f['specimenHeight'] = specimen.height
      }
    })
    return fontId
  })
}

const imageRe = /\.(svg|png|gif|jpg)$/
const filterImages = (list) => list.filter(o => imageRe.test(o))

getSheet().then(function (res) {
  getHeadlines().then(function(headlines) {

    // Sort by char len
    let filteredHeadlines = sortHeadlines(headlines);

    let data = parseFontData(res);

    // Override json settings text
    data.fonts.map(function (fontValue, i) {
      if (i < filteredHeadlines.length && filteredHeadlines[i]) {
        fontValue['settingsText'] = filteredHeadlines[i];
      }
    });

    getSpecimens()
      .then(filterImages)
      .then(getImageDimensions)
      .then(specimenImages => {

        // Add where we can
        addSpecimensToFonts(data, specimenImages)

        // Write file
        writeJSON(data).then(function () {
          console.log('Write to file: sheet.json');
        });
      })
      .catch(err => console.error(err))
  });
});
