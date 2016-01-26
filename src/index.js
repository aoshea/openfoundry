var express  = require('express'),
    mongoose = require('mongoose'),
    http    = require('http'),
    app     = express(),
    reqip   = require('request-ip'),
    port    = 7777
    ;

// Connect to database
mongoose.connect('mongodb://localhost:27017/openfoundry');

var fontSchema, Font;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('database connection');

  fontSchema = mongoose.Schema({
    fontId: String,
    likes: Number,
    ip: String
  });

  Font = mongoose.model('Font', fontSchema);
  Font.find(function (err, fonts) {
    if (err) console.error(err);
    else console.log(fonts);
  });
});

// set up Jade
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

/**
 * Routing / Index
 */
app.get('/', function (req, res) {
  res.render('index');
});

/**
 * Routing / Open Foundry List
 */
app.get('/open', function (req, res) {
  res.render('index');
});

/**
 * Routing / Font
 */
app.get('/open/:id', function (req, res) {
  res.render('index');
});

/**
 * API
 * Get all fonts
 */
app.get('/api/fonts/', function (req, res) {
  /*
  db.get('usercollection').find({}, function (err, doc) {
    if (err) {
      res.status(500, {
        error: err
      });
    } else {
      res.json(doc);
    }
  });
  */
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
 * Public files served as static
 */
app.use(express.static(__dirname + '/public'));

/**
 * Create server
 */
http.createServer(app).listen(port, function () {
  console.log('Express server running at port:' + port);
});

console.log('App: Listening on port:', port);