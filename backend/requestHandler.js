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
  // exports.signup = function(req, res){
  //   console.log('inside signup');

  //   var userInfo = req.body;
  //   //send query to mongo to check if user exists
  //   var users = DB.collection('users');

  //   users.insert(userInfo, function(err, inserted){
  //     if(err){
  //       throw err;
  //     }
  //     console.log(inserted);
  //   });

  // };

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
        userInfo.role = routingConfig.userRoles.user;
        res.cookie('userInfo', JSON.stringify(userInfo));
        console.log('should have hit redirect');
        res.send(200, found);
        DB.close();
        restartMongo();
      }
    });
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
      poster    : "current_user",
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

// exports.getArticle = function(req, res) {
//   var query = { '_id' : req.query.id };
//   DB.collection('posts').findOne(query, function(err, doc) {
//     if(err) throw err;

//     console.log("Collection being requested: ", doc);
//     res.send(200, doc);
//     DB.close();
//   });
// };

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

  console.log('userinfo.email is', userInfo.email);

  DB.collection('users').findOne({email: userInfo.email}, function(error, userByEmail){
    console.log('found ', userByEmail);
    if(error){
      throw error;
    }

    if(userByEmail === null){ // there is no existing user with the email
      console.log('isnull');
      isNew = true;
    }
  //   else{
  //     if(userByEmail)
  //     DB.collection('users').find({username: userInfo.username}, function(error, userByName){
  //       console.log('found ', userByName);
  //       if(userByName.username.length === 0){ // there is no existing user with the same name
  //         userInfo.role = routingConfig.userRoles.user;
  //         res.cookie('userInfo', JSON.stringify(userInfo));
  //         console.log('should have hit redirect');
  //         isNew = true; // the information does not exist in our db(new user)
  //       }else{
  //         res.send('the username exists'); // the username already exists!
  //       }
  //     });
  //   }else{
  //     res.send(); //the email already exists!
  //   }
    if(isNew){
      console.log('isnew');
      var user = {
        email   : req.body.email,
        username: req.body.username,
        password: req.body.password,
        role    : req.body.role
      };

      DB.collection('users').insert(user, function(error, savedUser) {
        console.log('saved', savedUser);
        res.send(200, savedUser);
        DB.close();
        restartMongo();
      });
    }else{ //not new
      console.log('signup fail');
      res.send(200, isNew); //
      DB.close();
      restartMongo();
    }
  });


};




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

