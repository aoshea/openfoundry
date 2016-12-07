const sizeOf = require('image-size')
const fs = require('fs')
const path = require('path')
const async = require('async')
const spawn = require('child_process').spawn
const svg2png = require('svg2png')

const dirs = {
  src: path.join(__dirname, 'fonts'),
  out: path.join(__dirname, 'build', 'specimens')
}

const replaceNonAlphaNumeric = (str, replacement = '_') => str.replace(/[^a-z0-9\.]/gim, replacement)

/**
 * Create directory if it doesnt exist
 */
const mkdirSync = path => {
  try {
    fs.mkdirSync(path)
  } catch(e) {
    if (e.code != 'EEXIST') throw e
  }
}

// Regex for replacing path > %___%
const inputRe = /%[^%]*%/g
// Regex for replacing name > $___$
const outputRe = /\$[^\$]*\$/g

// Imagemagick resize commands
const commands = {
  resize: [
    'convert',
    '%input%',
    '-resize', '2880x',
    '-format', 'jpg',
    '$output$'
  ]
}

/**
 * Copy file with error handling
 */
const copyFile = (src, target, callback) => {
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

const replaceExt = (str, ext) => str.replace(/.(png|svg|gif)$/, `.${ext}`)
const replaceSvg = str => {
  const svgRe = /.svg$/
  if (!svgRe.test(str)) return str
  return str.replace(svgRe, '.png')
}

const createConvertCallback = (svgObj) => (cb) => {
  const dir = svgObj.dir
  const svg = svgObj.src

  fs.readFile(path.join(dir, svg), (err, res) => {
    if (err) return cb(err)

    const filename = svg.replace(/.svg$/, '.png')

    svg2png(res)
      .then(buffer => fs.writeFile(path.join(dir, filename), buffer))
      .then(res => cb(null, res))
      .catch(e => cb(e))
  })
}

const convertSvgs = ({ dir, id, imageFiles }) => {
  return new Promise((resolve, reject) => {

    const svgRe = /.svg$/
    const fileObjs = imageFiles.filter(f => svgRe.test(f)).map(f => ({ src: f, dir: dir }))

    // Skip if nothing to see here
    if (fileObjs.length === 0) return resolve({ dir, id, imageFiles })

    const callbacks = fileObjs.map(createConvertCallback)

    async.series(callbacks, (err, res) => {
      if (err) return reject(err)
      return resolve({ dir, id, imageFiles })
    })
  })
}

const copyImages = ({ dir, id, imageFiles }) => {
  return new Promise((resolve, reject) => {

    console.log(`copyImages imageFiles${imageFiles.length}`, imageFiles)

    const callbacks = imageFiles.map(f => cb => {

      const filename = replaceSvg(f)
      const filePath = path.join(dir, filename)
      const outputPath = path.join(dirs.out, replaceExt(filename, 'jpg'))

      console.log(filePath)
      console.log(outputPath)

      let resizeCmd = commands.resize
      resizeCmd = resizeCmd.slice(1).map(cmd => {
        return cmd.replace(inputRe, filePath).replace(outputRe, outputPath)
      })
      const exec = spawn(commands.resize[0], resizeCmd)

      // Close if image write success
      exec.on('close', (code) => {
        const message = `created stamp image: ${code}`;
        console.error(`close exec: ${message}`);
        cb(code);
      });

      exec.stderr.on('data', data => {
        console.log('data', data)
        cb(data)
      })
    })

    async.series(callbacks, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

const getContents = obj => {
  return new Promise((resolve, reject) => {

    const dir = obj.path
    const id = obj.id

    fs.readdir(dir, (err, files) => {
      if (err) return reject(err)

      const previewRe = /preview/
      const imageExtRe = /\.(jpg|png|gif|svg)$/

      const imageFiles = files.filter(f => {
        return !previewRe.test(f) && imageExtRe.test(f)
      })

      const params = {
        dir, id, imageFiles
      }

      return copyImages(params)
    })
  })
}

const getAllContents = folders => {
  return Promise
    .all(folders.map(getContents))
    .catch(e => console.error(`Error getAllContents ${e}`))
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

        return o.match();
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

const getFontFolders = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err)

      const fileObjs = files.map(f => ({ id: f, path: path.join(dir, f)}))
      const folders = fileObjs.filter(o => {
        const stats = fs.statSync(o.path)
        return !o.path.match(/^\./) && stats.isDirectory();
      })

      return resolve(folders)
    })
  })
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

const init = (() => {
  getFontFolders(dirs.src)
    .then(getAllContents)
    .catch(e => console.error(e))
})()

/*
listFontSpecimens(dirs.src).then(function (res) {
  return Promise.all(res.map(listContents));
}).then(function (res) {
  outputCSS(res);
});
*/
