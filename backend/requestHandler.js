var apiKeys       = require('./apiKeys'),
    express       = require('express'),
    fs            = require("fs"),
    http          = require("http"),
    path          = require("path"),
    querystring   = require("querystring"),
    request       = require('request'),
    routingConfig = require ('../app/routingConfig.js'),
    url           = require("url");

var currentUserName;

//////////////////////////////////////////////
// Mongo Client
// //////////////////////////////////////////////

var db = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var DB = null;
// Connect to the db
MONGODB_URI = "mongodb://127.0.0.1:27017/newsapp";

var restartMongo = function(){
  db.connect(MONGODB_URI, function(err, db) {
    if(!err) {
      console.log("We are connected to MongoDB");
      DB = db;
    } else {
      console.log("Error connecting to DB.");
    }
  });
};

restartMongo();

//////////////////////////////////////////////
// Bootstrapper
//////////////////////////////////////////////
var now = new Date();
var jsonDate = now.toJSON();


//////////////////////////////////////////////
// End Bootstrapper
//////////////////////////////////////////////

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  //"Content-Type": "text/html"
};

//////////////////////////////////////////////
// User Authentication
//////////////////////////////////////////////
exports.signup = function(req, res) {
  var userInfo  = req.body,
      isNew     = false;

  DB.collection('users').findOne({email: userInfo.email}, function(error, userByEmail){
    if (error) throw error;

    if (userByEmail === null) { // there is no existing user with the email
      isNew = true;
    }
  
    if (isNew) {
      var user = {
        email   : req.body.email,
        image   : req.body.image,
        username: req.body.username,
        password: req.body.password,
        role    : routingConfig.userRoles.user
      };

      DB.collection('users').insert(user, function(error, savedUser) {
        var userInfo = savedUser[0];

        res.cookie('currentUser', JSON.stringify({
          username: userInfo.username,
          role: userInfo.role
        }));
        res.send(200, savedUser);
        currentUserName = savedUser.username;
      });
    } else { //not new
      res.send(200, isNew); //
    }
  });
};

exports.login = function(req, res){
    console.log('inside login');
    var userInfo = req.body;
    var isValid = false; 

    DB.collection('users').findOne({username: userInfo.username}, function(error, found){
      if(found === null){
        res.send(200, found);
      }else if(found.password === userInfo.password){ //FIX LATER need to hash
        res.cookie('currentUser', JSON.stringify({
          username: found.username,
          role: found.role
        }));
        currentUserName = found.username;
        res.send(200, found);
      }
    });
};


//////////////////////////////////////////////
// Resurce: Articles 
//////////////////////////////////////////////
exports.getArticles = function(request, response) {
  DB.collection('posts').find({}).toArray(function(error, articles) {
    if(error) throw error;

    console.log("Collection being requested: ", articles);
    response.send(200, articles); 
  });
};

exports.createArticle = function(req, res) {
  var url           = req.body.url,
      apiKey        = apiKeys.diffbot,
      scrapeDiffbot = 'http://api.diffbot.com/v2/article?token=' + apiKey + 
                      '&url=' + url;
  
  request(scrapeDiffbot, function(error, response, body){
    var diffbotArticle    = JSON.parse(body),
        diffbotParagraphs = diffbotArticle.text.split(/[\r\n]/g);
    var doc = {
      poster    : currentUserName,
      postTitle : "",
      postSource: diffbotArticle.url,
      hashtags: "",
      article   : {
        title     : diffbotArticle.title,

        // note this is an array of images, we can make a selection in the future
        image     : diffbotArticle.images[0].url,
        paragraphs: [],
        contributors :[]
      },
      comments   : [{
        commentor : "",
        comment   : ""
      }],
      timeline: []
    };

    for (var i = 0; i < diffbotParagraphs.length; i++) {
      var paragraph = {
        currentText : diffbotParagraphs[i],
        proposedText: []
      };

      doc.article.paragraphs.push(paragraph);
    }

    //we might need some sort of "wait while processing msg to the user here"
    DB.collection('posts').insert(doc, function(error, insertedDocument) {
      if (error) throw new Error("This document wasn't created.");

      var objectId = doc._id;

      res.send(200, objectId);
    });
  });
};


exports.newEdit = function(req, res) {
  var articleId      = req.body.articleId,
      paragraphIndex = req.body.paragraphIndex,
      newEditText    = req.body.newEditText,
      sources        = req.body.sources,
      username       = req.body.user;
  
  var query = {_id: new ObjectId(articleId)};

  DB.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;

    var obj = {username: username, text: newEditText, url: sources, vote: 0}
    var proposedText = post.article.paragraphs[paragraphIndex].proposedText.push(obj);
    DB.collection('posts').update(query, post, function(err, post){
      if(err) throw err;
    })
  })
};

exports.getArticle = function(req, res) {
  var id = req.query.id;
  var query = { '_id': new ObjectId(id) };
  DB.collection('posts').findOne(query, function(err, doc) {
    if(err) throw err;
        res.send(200, doc);
  });
};


exports.newestHeadlinesPost = function(req, res) {

};

exports.voteUp = function(req, res) {
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;

  var query    = {_id: new ObjectId(articleId)};
  DB.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;
    var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
    proposedText.vote++;
    var vote = proposedText.vote;

    DB.collection('posts').update(query, post, function(err, dontcare){
      if(err) throw err;
    });
  });
};

exports.editParagraph = function(req, res){
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;
  var username = req.body.user;

  var query    = {_id: new ObjectId(articleId)};

  DB.collection('posts').findOne(query, function(err, post) {
    if(err) throw new Error('error on finding post for edit paragraph');

    var currentPost = {};

    for (var key in post){
      if(key !== '_id' && key !== 'timeline'){
        currentPost[key] = post[key];
      }
    };

    post.timeline.push(currentPost)

    var contributor;

    DB.collection('users').findOne({username: username}, function(err, foundUser){
      contributor = foundUser;
      contributor.contribution = 1;


      var contributors = post.article.contributors;
      var topContributors = post.article.topContributors;
      var contributorIndex;
      var newContributor = true;

      for (var i = 0; i < contributors.length; i++) {
        if( contributors[i].username === contributor.username ){
          newContributor = false;
          contributorIndex = i;
          break;
        }
      };



      if( newContributor ){ // new contributor
        contributors.push(contributor);
      }else{
        contributors[contributorIndex].contribution++;
        for (var i = contributorIndex - 1 ; i > -1 ; i--) {
          if( contributors[contributorIndex].contribution > contributors[i].contribution ){
            contributors[contributorIndex] = contributors[i];
            contributors[i] = contributor;
          }else{
            break;
          }
        };
      }

      if( contributors.length > 0 ){
        topContributors = contributors.slice(0,2);
      }else{
        topContributors = [];
      }
      post.article.contributors = contributors;
      post.article.topContributors = topContributors;

      newContributor = true;

      var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];

      post.article.paragraphs[paragraphIndex].currentText = proposedText.text;
      post.article.paragraphs[paragraphIndex].proposedText = [];

      DB.collection('posts').update(query, post, function(err, dontcare){
        if(err) throw err;
      });
    });
  });
};


exports.voteDown = function(req, res) {
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;

  var query    = {_id: new ObjectId(articleId)};
  DB.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;

    var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
    proposedText.vote--;
    var vote = proposedText.vote;

    DB.collection('posts').update(query, post, function(err, dontcare){
      if(err) throw err;
    });
  });
};

exports.hashtags = function(req, res) {
  var hashtagInsert = req.body.hashtags;
  var query    = {_id: new ObjectId(req.body.articleId)};

  DB.collection('posts').update(query, { $set: { hashtags: hashtagInsert } }, function(error, doc){ });
};

exports.getTweets = function(req, res) {

    var hashtags = req.body.data['hashtags'];

    var CONSUMER_KEY = '7jZMP5zSiMHlOIxIIesgU45PD';
    var CONSUMER_SECRET = 'sBao8QTARsMjy8QpNQcoHTAgsv3cnXPXJYhFfjzGPzW6onSU8P';
    var keySecret = CONSUMER_KEY + ":" + CONSUMER_SECRET;
    var keySecret64 = new Buffer(keySecret, 'utf8').toString('base64');

    var qs = require('querystring');
    var headersWithKey = { 'User-Agent': 'request', 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Basic ' + keySecret64 };
    var url = 'https://api.twitter.com/oauth2/token';

    request.post({url:url, headers:headersWithKey,
      qs:{ 'grant_type': 'client_credentials' }
    }, function (e, r, body) {
      var twitterBearerToken = body;
      twitterBearerToken = JSON.parse(twitterBearerToken);
      var headersWithToken = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': twitterBearerToken['token_type'] + ' ' + twitterBearerToken['access_token']
      };
      
      hashtags = hashtags.replace("#", "%23");
      var twitterSearchUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=' + hashtags + '&count=12';
      
      request.get({url:twitterSearchUrl, headers:headersWithToken, qs:{} }, function (e, r, body) {
        body = JSON.parse(body);
        res.send(200, body);
      });
    });
};
