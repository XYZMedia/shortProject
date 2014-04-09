var express = require('express');
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var request = require('request');
var routingConfig = require ('../app/routingConfig.js');



//////////////////////////////////////////////
// Mongo Client
// //////////////////////////////////////////////
var db = require('mongodb').MongoClient;
var DB = null;
// Connect to the db
MONGODB_URI = "mongodb://127.0.0.1:27017/post";

db.connect(MONGODB_URI, function(err, db) {
  if(!err) {
    console.log("We are connected to MongoDB");
    DB = db;
  } else {
    console.log("Error connecting to DB.");
  }
});


//////////////////////////////////////////////
// Bootstrapper
//////////////////////////////////////////////


var now = new Date();
var jsonDate = now.toJSON();

// db.execute('INSERT INTO users (userId, fname, lname, whenJoined) VALUES (' + userId + ', \'john\', \'smith\', dateof(now()));',
//   function(err, result){
//     if (err) console.log('execute failed:' + err);
//     else console.log('inserted rows');
//   }
// );

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

//EUGENECHOI
  exports.signup = function(req, res){
    console.log('inside signup');

    var userInfo = req.body;
    //send query to mongo to check if user exists
    var users = DB.collection('users');

    users.insert(userInfo, function(err, inserted){
      if(err){
        throw err;
      }
      console.log(inserted);
    });

  };

exports.login = function(req, res){
    console.log('inside auth');

    var userInfo = req.body;
    //send query to mongo to check if user exists
    // db.insert()
    if(1===1){ // if the query to dbMongo identified the user as existing user
      userInfo.role = routingConfig.userRoles.user;
      res.cookie('userInfo', JSON.stringify(userInfo));
      console.log('should have hit redirect')
    }else{
     // res.send(300, '/login')
    }
      // if(req.user) {
      //     role = req.user.role;
      //     username = req.user.username;
      // }

      // res.cookie('user', JSON.stringify({
      //     'username': username,
      //     'role': role
      // }));

      // res.send('index');
      res.send(200);
  };



exports.createArticle = function(req, res) {
  var url = req.body.articleUrl;
  var apiKey = 'c6da1b5b8fed3a1501866f95ff8fd91c';

  request('http://api.diffbot.com/v2/article?token=' + apiKey + '&url=' + url, function(error, response, body){
    var obj = JSON.parse(body);
    var cho = obj.text.split(/[\r\n]/g);

    var doc = {
      poster    : "current_user",
      postTitle : "",
      postSource: obj.url,
      article   : {
        title     : obj.title,
        image     : obj.images.url,
        paragraphs: []
      },
      comments   : [{
        commentor : "",
        comment   : ""
      }]
    };

    for (var i = 0; i < cho.length; i++) {
      var paragraph = {
        currentText : cho[i],
        proposedText: [{
          editor: "",
          text  : "",
          vote  : 0
        }]
      }

      doc.article.paragraphs.push(paragraph);
    }

    DB.collection('posts').insert(doc, function(error, inserted) {
      res.send(200, inserted);
      DB.close();
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
  });
};

exports.getArticle = function(req, res) {
  var query = { '_id' : req.params.id };
  DB.collection('posts').findOne(query, function(err, doc) {
    if(err) throw err;

    console.log("Collection being requested: ", doc);
    res.send(200, doc);
    DB.close();
  });
};


exports.newestHeadlinesPost = function(req, res) {

};

exports.createUser = function(req, res) {
  var user = {
    email   : req.params.email,
    username: req.params.username,
    password: re.params.password,
    role    : "role.public"
  };

  DB.collection('users').insert(user, function(error, savedUser) {
    res.send(200, savedUser);
    DB.close();
  });
};

exports.getUser = function(req, res) {
  var query = { 'username' : req.params.username, 'password': req.params.password };
  DB.collection('users').findOne(query, function(err, user) {
    if(err) throw err;

    console.log("Collection being requested: ", user);
    res.send(200, user);
    DB.close();
  });
};
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

