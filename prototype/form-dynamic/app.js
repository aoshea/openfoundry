var express = require('express')
var app = express()

var ofSubmission = require('./of-submission')
var ofMailchimp = require('./of-mailchimp')

var bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'public' })
})

app.post('/submit', function (req, res, next) {
  ofSubmission.process(req.body, function (result) {
    res.json(result)
  })
})

app.get('/newsletter-external', function (req, res) {
  res.sendFile('newsletter-external.html', { root: 'public' })
})

app.get('/newsletter', function (req, res) {
  res.sendFile('newsletter.html', { root: 'public' })
})

app.post('/newsletter-submit', function (req, res, next) {
  console.log(req.body)
  ofMailchimp.subscribe(req.body.EMAIL, function (result) {
    res.json(result)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
