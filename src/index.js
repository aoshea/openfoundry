var express = require('express'),
    http    = require('http'),
    app     = express(),
    port    = 3700
    ;

// set up Jade
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
    
app.get('/', function (req, res) {  
  res.render('index');
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