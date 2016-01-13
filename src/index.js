var express = require('express'),
    //mongo   = require('mongodb'),
    //monk    = require('monk'),
    //db      = monk('localhost:27017/oftest'),
    http    = require('http'),
    app     = express(),
    reqip   = require('request-ip'),
    port    = 7777
    ;

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
  
  db.get('usercollection').find({}, function (err, doc) {
    if (err) {
      res.status(500, {
        error: err
      });
    } else {
      res.json(doc);
    }
  });
});

/**
 * API 
 * Get one font by fontId eg. 'Bagnan_Regular'
 */
app.get('/api/fonts/:fontId', function (req, res) {
  /*
  var collection = db.get('usercollection'),
      requestIp = reqip.getClientIp(req);
  
  collection.findOne({fontId: req.params.fontId}, function (err, doc) {
    if (err) {
      res.status(500, {
        error: err
      });
    } else {
      
      if (doc) {
        console.log(doc.fontId, doc.ip, doc.likes);
      
        if (doc.ip === requestIp) {
          doc.locked = true;
        } else {
          doc.locked = false;
        }
      }
      
      res.json(doc);
    }
  });
  */
  res.sendStatus(200);
});

app.get('/api/like/:fontId', function (req, res) {
  /*
  var ipadd = reqip.getClientIp(req); // on localhost > 127.0.0.1
  var collection = db.get('usercollection');
  var willAdd = false;
  
  collection.findOne({
    fontId: req.params.fontId,
    ip: ipadd
  },
  function (err, doc) {
    if (err) {
      willAdd = true;
    } else {
      if (doc) {
        willAdd = false;
      } else {
        willAdd = true;
      }      
    }
  }).then(function () {
    
    if (!willAdd) return; 
    
    collection.update(
      { fontId: req.params.fontId },
      { $inc: { likes:1 }, $set: { ip: ipadd } },
      { upsert: true },
      function (err, doc) {
        if (err) res.sendStatus(404)
        else res.sendStatus(200);
      }
    );
  });
  */
  res.sendStatus(200);
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