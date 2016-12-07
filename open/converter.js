const fs = require('fs')
const path = require('path')
const svg2png = require('svg2png')
const async = require('async')

const dir = path.join(__dirname, 'build', 'specimens')

const createConvertCallback = (svg) => (cb) => {
  fs.readFile(path.join(dir, svg), (err, res) => {
    if (err) return cb(err)

    const filename = svg.replace(/.svg$/, '.png')

    svg2png(res)
      .then(buffer => fs.writeFile(path.join(dir, filename), buffer))
      .then(res => cb(null, res))
      .catch(e => cb(e))
  })
}

const convertSvgs = (svgs) => {
  return new Promise((resolve, reject) => {
    const callbacks = svgs.map(createConvertCallback)

    async.series(callbacks, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

const readDir = (() => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err

    const re = /.svg$/
    const svgs = files.filter(f => re.test(f))
    return convertSvgs(svgs)
  })
})()
