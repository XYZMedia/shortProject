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

  app.post('/login', handler.login);

  app.post('/signup', handler.signup);

  app.post('/newpost', handler.createArticle);

  app.post('/voteUp', handler.voteUp)

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




// app.get('/articles', handler.articles);
// // app.options('/newestheadlines', handler.newestHeadOptions);
// app.post('/createArticle', handler.createArticle);
// app.get('/getArticle', handler.getArticle);
// // app.options('/article', handler.articleOptions);

// //app.post('/signup', handler.signup);
// app.post('/getUser', handler.getUser);
