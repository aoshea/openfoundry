const express     = require('express'),
      compression = require('compression'),
      mongoose    = require('mongoose'),
      http        = require('http'),
      app         = express(),
      reqip       = require('request-ip'),
      fonts       = require('./public/data/sheet.json'),
      bodyParser  = require('body-parser')
      port        = 7777

// NOTE: the env is set to 'development' by gulp-nodemon
const nodeEnv = process.env.NODE_ENV || 'production'
const weinre = process.env.OF_WEINRE === 'true'
const debug = process.env.OF_DEBUG === 'true'

// Generic local variables to pass to views
const genericViewVars = {
  url: decodeURIComponent('http://open-foundry.com'),
  title: decodeURIComponent('Open Foundry'),
  description: 'A new platform for open-source fonts in a noise-free environment, to highlight their beauty, extend functionality and encourage further exploration.',
  img: decodeURIComponent('http://open-foundry.com/img/of-cover-preview.jpg'),
  nodeEnv: nodeEnv,
  weinre: !!weinre,
  debug: !!debug
}

const ofSubmission = require('./inc/of-submission')
const ofMailchimp = require('./inc/of-mailchimp')

const replaceNonAlphaNumeric = (str, replacement) => {
  if (replacement === undefined || replacement === null) replacement = '_'
  return str.replace(/[^a-z0-9\.]/gim, replacement)
}

// Connect to database
mongoose.connect('mongodb://localhost:27017/openfoundry')

let fontSchema, Font

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  fontSchema = mongoose.Schema({
    fontId: String,
    likes: Number,
    ip: String
  })

  Font = mongoose.model('Font', fontSchema)

  // Only create server once we have connected to the database
  http.createServer(app).listen(port, function () {
    console.log('Express server running at port:' + port + ' in ' + nodeEnv + ' mode')
  })
})

// set up Jade
app.set('views', __dirname + '/tpl')
app.set('view engine', 'pug')

/**
 * Render views
 */
app.get('/', function (req, res) {
  res.render('index', localVars)
})

app.get('/about', function (req, res) {
  res.render('index', localVars)
})

app.get('/submit', function (req, res) {
  res.render('index', localVars)
})

app.get('/hot30/:id', function (req, res) {
  const fontId = req.params.id

  const matches = fonts.fonts.filter(function (font) {
    const id = font['fontId']
    return replaceNonAlphaNumeric(id).toLowerCase() === fontId
  })
  const currentFont = matches.length ? matches[0] : null

  const viewVars = Object.assign({}, genericViewVars)
  viewVars.nodeEnv = nodeEnv
  viewVars.weinre = weinre
  viewVars.debug = debug
  viewVars.url = decodeURIComponent('http://open-foundry.com/hot30/' + fontId)
  viewVars.title = decodeURIComponent(currentFont['font-name'] + ' ' + currentFont['font-style'])
  viewVars.description = decodeURIComponent(currentFont['info-about'])
  viewVars.img = decodeURIComponent('http://open-foundry.com/data/specimens/specimen-' + fontId + '-preview.jpg')

  res.render('index', viewVars)
})

app.get('/hot30', (req, res) => {
  res.render('index', genericViewVars)
})

app.get('/signup', (req, res) => {
  res.render('index', genericViewVars)
})

app.get('/debug', (req, res) => {
  res.render('index', genericViewVars)
})

/**
 * API
 * Get all fonts
 */
app.get('/api/fonts/', (req, res) => {
  Font.find({}, (err, docs) => {
    if (err) {
      res.sendStatus(500, {
        error: err
      })
    } else {
      res.json({
        docs: docs
      })
    }
  })
})

/**
 * API
 * Get one font by fontId eg. 'Bagnan_Regular'
 */
app.get('/api/fonts/:fontId', function (req, res) {
  const requestIp = reqip.getClientIp(req)

  Font.findOne(
    {fontId: req.params.fontId},
    (err, doc) => {
      if (err) {
        res.status(500, {
          error: err
        })
      } else {
        if (doc) {
          res.json({
            doc: doc,
            locked: (doc.ip === requestIp)
          })
        } else {
          res.sendStatus(200)
        }
      }
    }
  )
})

/**
 * API : Like font
 * Increment like count for font with fontId
 */
app.get('/api/like/:fontId', (req, res) => {

  const ipAddress = reqip.getClientIp(req)

  Font.findOneAndUpdate(
    {fontId: req.params.fontId},
    {$inc: {likes: 1}, $set: {ip: ipAddress}},
    {upsert: true},
    (err, doc) => {
      if (err) return res.send(500, { error: err })
      return res.json(doc)
    }
  )
})

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(compression())

app.post('/submit', (req, res, next) => {
  ofSubmission.process(req.body, result => res.json(result))
})

app.post('/newsletter', (req, res, next) => {
  ofMailchimp(req.body.EMAIL, (result) => res.json(result))
})

app.use(express.static(__dirname + '/public'))

app.use((req, res) => {
  res.status(404).send('404: Page not found')
})
