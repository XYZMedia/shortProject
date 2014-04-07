var express = require('express');
var path = require('path');
var handler = require ('./requestHandler.js');

var app = express();

app.configure(function() {

  app.use(express.bodyParser());

  app.use(express.static(path.join(__dirname, '../app')));
  app.listen(8080);
  console.log('Listening on port 8080');
});

app.get('/newestheadlines', handler.newestHeadlinesGet);
// app.options('/newestheadlines', handler.newestHeadOptions);

app.post('/article', handler.articlePost);
app.get('/articleGet', handler.articleGet);
// app.options('/article', handler.articleOptions);
