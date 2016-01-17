var express = require('express')
var app = express()

var ofSubmission = require('./of-submission')

var bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static('public'))

app.get('/', function (req, res) {
  //res.sendfile('/public/index.html')
})

app.post('/submit', function (req, res, next) {
  ofSubmission.process(req.body, function (result) {
    console.log(req.body)
    res.json(result)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})













