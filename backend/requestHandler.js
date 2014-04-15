var express       = require('express'),
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
    if(error){
      throw error;
    }

    if(userByEmail === null){ // there is no existing user with the email
      isNew = true;
    }
  
    if(isNew){
      var user = {
        email   : req.body.email,
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
        DB.close();
        restartMongo();
      });
    }else{ //not new
      res.send(200, isNew); //
      DB.close();
      restartMongo();
    }
  });
};

exports.login = function(req, res){
    console.log('inside login');
    var userInfo = req.body;
    var isValid = false; //to check if the userinfo is correct

    //send query to mongo to check if user exists

    //db.insert();
     // DB.collection('users').insert(user, function(error, savedUser) {
    console.log('req.body is, ', userInfo);
    DB.collection('users').findOne({username: userInfo.username}, function(error, found){
      console.log('error is, ', error);
      console.log('userInfo.username is, ', userInfo.username);
      console.log('user found is, ', found);
      if(found === null){
        res.send(200, found);
        DB.close();
        restartMongo();
      }else if(found.password === userInfo.password){ //FIX LATER need to hash
        console.log('password matches!');
        res.cookie('currentUser', JSON.stringify({
          username: found.username,
          role: found.role
        }));
        currentUserName = found.username;
        console.log('should have hit redirect');
        res.send(200, found);
        DB.close();
        restartMongo();
      }
    });
};


//////////////////////////////////////////////
// Article
//////////////////////////////////////////////
exports.newEdit = function(req, res) {
  var articleId      = req.body.articleId,
      paragraphIndex = req.body.paragraphIndex,
      newEditText    = req.body.newEditText,
      sources        = req.body.sources;
  
  var query = {_id: new ObjectId(articleId)};

  DB.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;

    var obj = {text: newEditText, url: sources, vote: 0}
    var proposedText = post.article.paragraphs[paragraphIndex].proposedText.push(obj);
    
    DB.collection('posts').update(query, post, function(err, post){
      if(err) throw err;
    })
  })
};


exports.createArticle = function(req, res) {

  var url = req.body.url;
  var apiKey = 'c6da1b5b8fed3a1501866f95ff8fd91c';
   request('http://api.diffbot.com/v2/article?token=' + apiKey + '&url=' + url, function(error, response, body){
    //console.log('body is ', body);
    var obj = JSON.parse(body);
    //console.log(obj);
    var cho = obj.text.split(/[\r\n]/g);
    //console.log(cho);
    var doc = {
      poster    : currentUserName,
      postTitle : "",
      postSource: obj.url,
      article   : {
        title     : obj.title,
        // note this is an array of images, we can make a selection in the future
        image     : obj.images[0].url,
        paragraphs: []
      },
      comments   : [{
        commentor : "",
        comment   : ""
      }],
    };

    for (var i = 0; i < cho.length; i++) {
      var paragraph = {
        currentText : cho[i],
        proposedText: []
      };
      doc.article.paragraphs.push(paragraph);
    }

    //we might need some sort of "wait while processing msg to the user here"
    DB.collection('posts').insert(doc, function(error, inserted) {
      var objectId = doc._id;
      //console.log(objectId);
      res.send(200, objectId);
      DB.close();
      restartMongo();
    });
  });
};

// This function needs to eventually limit the number of documents being retrieved and sort those documents
exports.articles = function(req, res) {
  DB.collection('posts').find({}).toArray(function(err, docs) {
    if(err) throw err;

    console.log("Collection being requested: ", docs);
    res.send(200, docs);
    DB.close();
    restartMongo();
  });
};


exports.getArticle = function(req, res) {
  var id = req.query.id;
  console.log("OBJ ID: ", id)
  var query = { '_id': new ObjectId(id) };
  DB.collection('posts').findOne(query, function(err, doc) {
    if(err) throw err;

    console.log("Collection being requested: ", doc);
    res.send(200, doc);
//    DB.close();
  });
};


exports.newestHeadlinesPost = function(req, res) {

};

exports.signup = function(req, res) {

  var userInfo = req.body;
  var isNew = false;


  DB.collection('users').findOne({email: userInfo.email}, function(error, userByEmail){
    if(error){
      throw error;
    }

    if(userByEmail === null){ // there is no existing user with the email
      isNew = true;
    }

    if(isNew){
      var user = {
        email   : req.body.email,
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
        DB.close();
        restartMongo();
      });
    }else{ //not new
      res.send(200, isNew); //
      DB.close();
      restartMongo();
    }
  });

};


exports.voteUp = function(req, res) {
  console.log('voteUp!');
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;

  var query    = {_id: new ObjectId(articleId)};
  DB.collection('posts').findOne(query, function(err, post) {
    console.log('voteUp, found post, ', post);
    if(err) throw err;
    var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
    proposedText.vote++;
    var vote = proposedText.vote;
    console.log('vote after voteUp is, ', vote)

    DB.collection('posts').update(query, post, function(err, dontcare){
      if(err) throw err;
    });
  });
};

exports.editParagraph = function(req, res){
  var articleId = req.body.articleId;
  var paragraphIndex = req.body.paragraphIndex;
  var editIndex = req.body.editIndex;

  var query    = {_id: new ObjectId(articleId)};
  console.log("BEFORE DB");


  DB.collection('posts').findOne(query, function(err, post) {
    if(err) throw err;

    // var timeLineId = articleId + 'timeline';

    // DB.collection(timeLineId).insert(post, function(err, savedPost){
    //     if(err) throw err;
    //     console.log('saved Post is', savedPost);
    // });


    var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
    post.article.paragraphs[paragraphIndex].currentText = proposedText.text;

    console.log('proposed text afer edit ', post.article.paragraphs[paragraphIndex]);

    DB.collection('posts').update(query, post, function(err, dontcare){
      if(err) throw err;
      console.log('dont care is', dontcare);
    });
    console.log('after update, proposed text is,', post.article.paragraphs[paragraphIndex]);
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

// exports.editParagraph = function(req, res){
//   var articleId = req.body.articleId;
//   var paragraphIndex = req.body.paragraphIndex;
//   var editIndex = req.body.editIndex;

//   var query    = {_id: new ObjectId(articleId)};
//   console.log("BEFORE DB");


//   DB.collection('posts').findOne(query, function(err, post) {
//     if(err) throw err;

//     // var timeLineId = articleId + 'timeline';

//     // DB.collection(timeLineId).insert(post, function(err, savedPost){
//     //     if(err) throw err;
//     //     console.log('saved Post is', savedPost);
//     // });


//     var proposedText = post.article.paragraphs[paragraphIndex].proposedText[editIndex];
//     post.article.paragraphs[paragraphIndex] = proposedText.text;

//     console.log('proposed text afer edit ', post.article.paragraphs[paragraphIndex]);

//     DB.collection('posts').update(query, post, function(err, dontcare){
//       if(err) throw err;
//       console.log('dont care is', dontcare);
//     });
//     console.log('after update, proposed text is,', post.article.paragraphs[paragraphIndex]);
//   });
// };
  //add
    // DB.close();
    // restartMongo();
// DB.collection('posts').findOne({_id: new ObjectId(articleId) }, function(err, post) {
//  console.log('updated post', post)
//  })
// }




// exports.getUser = function(req, res) {
//   var query = { 'username' : req.params.username, 'password': req.params.password };
//   DB.collection('users').findOne(query, function(err, user) {
//     if(err) throw err;

//     console.log("Collection being requested: ", user);
//     res.send(200, user);
//     DB.close();
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

