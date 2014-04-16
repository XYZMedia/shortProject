var express = require('express');
var path = require('path');
var handler = require ('./requestHandler.js');
var app = express();
var cors = require('cors');
var passport = require('passport');


app.configure(function() {
  app.use(express.bodyParser());
  app.use(cors());
  app.use(express.static(path.join(__dirname, '../app')));

  app.get('/articles', handler.articles);
  app.get('/getArticle', handler.getArticle);
  app.post('/newpost', handler.createArticle);
  app.post('/newEdit', handler.newEdit);

  app.post('/signup', handler.signup);
  app.post('/login', handler.login);

  app.post('/voteUp', handler.editParagraph);

  app.post('/voteDown', handler.voteDown);

  app.post('/voteUp', handler.voteUp);

  app.post('/edit', handler.editParagraph);

  app.post('/newEdit', handler.newEdit);

  app.post('/getTweets', handler.getTweets);

  // app.get('/login', function(req, res){
  //   console.log('inside auth');
  //   res.send('loginresponse');
  //     var role = routingConfig.userRoles.public,
  //         username = '';

  //     if(req.user) {
  //         role = req.user.role;
  //         username = req.user.username;
  //     }

  //     res.cookie('user', JSON.stringify({
  //         'username': username,
  //         'role': role
  //     }));

  //     res.render('index');
  // });

  app.use(express.cookieParser());
  app.use(express.cookieSession({
    secret: 'hello'
  }));

  app.listen(8080);
  console.log('Listening on port 8080');
});

