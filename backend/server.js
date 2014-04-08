var express = require('express');
var path = require('path');
var handler = require ('./requestHandler.js');

var app = express();

app.configure(function() {

  app.use(express.bodyParser());

  app.use(express.static(path.join(__dirname, '../app')));

  app.get('/', function(req, res){
    console.log('inside auth');
      var role = routingConfig.userRoles.public,
          username = '';

      if(req.user) {
          role = req.user.role;
          username = req.user.username;
      }

      res.cookie('user', JSON.stringify({
          'username': username,
          'role': role
      }));

      res.render('index');
  });
  
  app.get('/login', function(req, res){
    console.log('inside auth');
    res.send('loginresponse');
      var role = routingConfig.userRoles.public,
          username = '';

      if(req.user) {
          role = req.user.role;
          username = req.user.username;
      }

      res.cookie('user', JSON.stringify({
          'username': username,
          'role': role
      }));

      res.render('index');
  });

  app.use(express.cookieParser());
  app.use(express.cookieSession({
    secret: 'hello'
  }));


  app.listen(8080);
  console.log('Listening on port 8080');
});

// app.get('/newestheadlines', handler.newestHeadlinesGet);
// // app.options('/newestheadlines', handler.newestHeadOptions);

// app.post('/article', handler.articlePost);
// app.get('/articleGet', handler.articleGet);
// app.options('/article', handler.articleOptions);
