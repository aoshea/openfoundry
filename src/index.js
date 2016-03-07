var express  = require('express'),
    mongoose = require('mongoose'),
    http    = require('http'),
    app     = express(),
    reqip   = require('request-ip'),
    fonts   = require('./public/data/sheet.json'),
    port    = 7777
    ;

// NOTE: the env is set to 'development' by gulp-nodemon
var nodeEnv = process.env.NODE_ENV || 'production';

// Generic local variables to pass to views
var localVars = {
  url: decodeURIComponent('http://open-foundry.com'),
  title: decodeURIComponent('Open Foundry'),
  description: 'A new platform for open-source fonts in a noise-free environment, to highlight their beauty, extend functionality and encourage further exploration.',
  img: decodeURIComponent('http://open-foundry.com/img/of-cover.jpg'),
  nodeEnv: nodeEnv
};

var ofSubmission = require('./inc/of-submission');
var ofMailchimp = require('./inc/of-mailchimp');

function replaceNonAlphaNumeric(str, replacement) {
  if (replacement === undefined || replacement === null) replacement = '_';
  return str.replace(/[^a-z0-9\.]/gim, replacement);
}

// Connect to database
mongoose.connect('mongodb://localhost:27017/openfoundry');

var fontSchema, Font;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  fontSchema = mongoose.Schema({
    fontId: String,
    likes: Number,
    ip: String
  });

  Font = mongoose.model('Font', fontSchema);
});

// set up Jade
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

/**
 * Render views
 */
app.get('/', function (req, res) {
  res.render('index', localVars);
});

app.get('/about', function (req, res) {
  res.render('index', localVars);
});

app.get('/submit', function (req, res) {
  res.render('submit', localVars);
});

app.get('/hot30', function (req, res) {
  res.render('index', localVars);
});

app.get('/signup', function (req, res) {
  res.render('index', localVars);
})

app.get('/debug', function (req, res) {
  res.render('index', localVars);
})

app.get('/hot30/:id', function (req, res) {
  var fontId = req.params.id
  var matches = fonts.filter(function (font) {
    var id = font['font-id'];
    return replaceNonAlphaNumeric(id).toLowerCase() === fontId;
  });
  var currentFont = matches.length ? matches[0] : null;

  var viewVars = localVars;
  viewVars.url = decodeURIComponent('http://open-foundry.com/hot30/' + fontId);
  viewVars.title = decodeURIComponent(currentFont['font-name'] + ' ' + currentFont['font-style']);
  viewVars.description = decodeURIComponent(currentFont['info-about']);
  viewVars.img = decodeURIComponent('http://open-foundry.com/data/specimens/specimen-' + fontId + '.svg');

  res.render('index', viewVars);
});


/**
 * API
 * Get all fonts
 */
app.get('/api/fonts/', function (req, res) {
  Font.find({}, function (err, docs) {
    if (err) {
      res.sendStatus(500, {
        error: err
      });
    } else {
      res.json({
        docs: docs
      });
    }
  });
});

/**
 * API
 * Get one font by fontId eg. 'Bagnan_Regular'
 */
app.get('/api/fonts/:fontId', function (req, res) {
  var requestIp = reqip.getClientIp(req);

  Font.findOne(
    {fontId: req.params.fontId},
    function (err, doc) {
      if (err) {
        res.status(500, {
          error: err
        });
      } else {
        if (doc) {
          res.json({
            doc: doc,
            locked: (doc.ip === requestIp)
          });
        } else {
          res.sendStatus(200);
        }
      }
    }
  );
});

/**
 * API : Like font
 * Increment like count for font with fontId
 */
app.get('/api/like/:fontId', function (req, res) {

  var ipAddress = reqip.getClientIp(req);

  Font.findOneAndUpdate(
    {fontId: req.params.fontId},
    {$inc: {likes: 1}, $set: {ip: ipAddress}},
    {upsert: true},
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Saved");
    }
  );
});


/**
 * Use body parser so we can work with form data
 */

var bodyParser = require('body-parser')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/submit', function (req, res, next) {
  ofSubmission.process(req.body, function (result) {
    res.json(result);
  });
});

app.post('/newsletter', function (req, res, next) {
  console.log(req.body);
  ofMailchimp(req.body.EMAIL, function (result) {
    res.json(result);
  });
});

/**
 * Public files served as static
 */
app.use(express.static(__dirname + '/public'));

/**
 * Create server
 */
http.createServer(app).listen(port, function () {
  console.log('Express server running at port:' + port + ' in ' + nodeEnv + ' mode');
});
