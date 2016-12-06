const fs = require('fs')
const path = require('path')
const svg2png = require('svg2png')

const src = path.join(__dirname, 'build/specimens/specimen-archivo-narrow-regular.svg')

fs.readFile(src, (err, res) => {

  console.log(err, res)

  if (err) {
    return console.error(err)
  }

  svg2png(res)
    .then(buffer => fs.writeFile('destination.png', buffer))
    .catch(e => console.error(e))

})

