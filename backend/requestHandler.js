var apiKeys       = require('./../config.js'),
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

var MongoClient = require('mongodb').MongoClient,
    Server      = require('mongodb').Server,
    ObjectId    = require('mongodb').ObjectID,
    mongoclient = new MongoClient(new Server('localhost', 27017)),
    db          = mongoclient.db('newsapp');

mongoclient.open(function(err, mongoclient) {
    if(error) throw error;

    console.log("mongoclient ready.");
});


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

  db.collection('users').findOne({email: userInfo.email}, function(error, userByEmail){
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

      db.collection('users').insert(user, function(error, savedUser) {
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
    var isValid = false; //to check if the userinfo is correct

    //send query to mongo to check if user exists

    //db.insert();
     // db.collection('users').insert(user, function(error, savedUser) {
    //console.log('req.body is, ', userInfo);
    db.collection('users').findOne({username: userInfo.username}, function(error, found){
      console.log('error is, ', error);
      console.log('userInfo.username is, ', userInfo.username);
      console.log('user found is, ', found);
      if(found === null){
        res.send(200, found);
      }else if(found.password === userInfo.password){ //FIX LATER need to hash
        console.log('password matches!');
        res.cookie('currentUser', JSON.stringify({
          username: found.username,
          role: found.role
        }));
        currentUserName = found.username;

        console.log('should have hit redirect');
        res.send(200, found);
      }
    });
};


//////////////////////////////////////////////
// Resurce: Articles 
//////////////////////////////////////////////
exports.getArticles = function(request, response) {
  db.collection('posts').find({}).toArray(function(error, articles) {
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
  console.log(diffbotArticle)
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
    db.collection('posts').insert(doc, function(error, insertedDocument) {
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

  db.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;

    var obj = {username: username, text: newEditText, url: sources, vote: 0}
    var proposedText = post.article.paragraphs[paragraphIndex].proposedText.push(obj);
    db.collection('posts').update(query, post, function(err, post){
      if(err) throw err;
    })
  })
};



exports.getArticle = function(req, res) {
  var id = req.query.id;
  //console.log("OBJ ID: ", id)
  var query = { '_id': new ObjectId(id) };
  db.collection('posts').findOne(query, function(err, doc) {
    if(err) throw err;
    
    // console.log('timeline found is ', doc.timeline.length);
    //console.log("Collection being requested: ", doc);
    res.send(200, doc);
  });
};


exports.newestHeadlinesPost = function(req, res) {

};


exports.voteUp = function(req, res) {
  console.log('voteUp!');
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;

  var query    = {_id: new ObjectId(articleId)};
  db.collection('posts').findOne(query, function(err, post) {
    console.log('voteUp, found post, ', post);
    if(err) throw err;
    var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
    proposedText.vote++;
    var vote = proposedText.vote;
    console.log('vote after voteUp is, ', vote)

    db.collection('posts').update(query, post, function(err, dontcare){
      if(err) throw err;
    });
  });
};

exports.editParagraph = function(req, res){
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;
  var username = req.body.user;
  console.log('initial username is, ', username);

  var query    = {_id: new ObjectId(articleId)};

  db.collection('posts').findOne(query, function(err, post) {
    if(err) throw new Error('error on finding post for edit paragraph');
    console.log('articleId');

    var currentPost = {};

    for (var key in post){
      if(key !== '_id' && key !== 'timeline'){
        currentPost[key] = post[key];
      }
    };


    console.log(post.timeline);

    post.timeline.push(currentPost)
    console.log(post.timeline)


console.log('asdsf', post.timeline)


    var contributor;

    db.collection('users').findOne({username: username}, function(err, foundUser){
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
        console.log('new contributor');
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

      db.collection('posts').update(query, post, function(err, dontcare){
        if(err) throw err;
        console.log('3')
        console.log('dont care is', dontcare);
      });
    });
  });
};


exports.voteDown = function(req, res) {
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;

  var query    = {_id: new ObjectId(articleId)};
  db.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;

    var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
    proposedText.vote--;
    var vote = proposedText.vote;

    db.collection('posts').update(query, post, function(err, dontcare){
      if(err) throw err;
    });
  });
};



// exports.getUser = function(req, res) {
//   var query = { 'username' : req.params.username, 'password': req.params.password };
//   db.collection('users').findOne(query, function(err, user) {
//     if(err) throw err;

//     console.log("Collection being requested: ", user);
//     res.send(200, user);
//   });
// };
// exports.articleUpdate = function(req, res) {

//   // Set value of _id to id of current object
//   var query    = { '_id' : 'FILL_IN' };

//   // Set value of article.p1 to input field
//   var operator = { '$set' : { 'article.p1' : "FILL_IN" } };

//   db.collection('posts').update(query, operator, function(err, updated) {
//     if(err) throw err;

//     console.dir("Successfully updated: " + updated);
//     //  we need to redirect or reload the page
//     response.send(200, updated)
//     return db.close();
//   });
// };


exports.hashtags = function(req, res) {
  var hashtagInsert = req.body.hashtags;
  var query    = {_id: new ObjectId(req.body.articleId)};

  db.collection('posts').update(query, { $set: { hashtags: hashtagInsert } }, function(error, doc){ });
  console.log("success in exports.hashtags");
};

exports.getTweets = function(req, res) {

    var hashtags        = req.body.data['hashtags'];

    var CONSUMER_KEY    = apiKeys.twitterConsumerKey;
    var CONSUMER_SECRET = apiKeys.twitterConsumerSecret;
    var keySecret       = CONSUMER_KEY + ":" + CONSUMER_SECRET;
    var keySecret64     = new Buffer(keySecret, 'utf8').toString('base64');

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
        //console.log(body);
        body = JSON.parse(body);
        res.send(200, body);
      });
    });
};
