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

  app.get('/articles', handler.getArticles);
  app.post('/newpost', handler.createArticle);

  app.get('/getArticle', handler.getArticle);
  app.post('/newEdit', handler.newEdit);


  app.post('/signup', handler.signup);
  app.post('/login', handler.login);

  app.post('/voteUp', handler.editParagraph);

  app.post('/voteDown', handler.voteDown);
  app.post('/voteUp', handler.voteUp);
  
  app.post('/edit', handler.editParagraph);
  app.post('/newEdit', handler.newEdit);


  app.use(express.cookieParser());
  app.use(express.cookieSession({
    secret: 'hello'
  }));

  app.listen(8080);
  console.log('Listening on port 8080');
});

