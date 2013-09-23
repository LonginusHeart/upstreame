var express = require('express');
var app = express();

// configure express
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// setup middleware
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

// root route
app.get('/', function(req, res){
  res.render('index', {
    title: 'ScriptInvaders'
  });
});

app.listen(3000);
