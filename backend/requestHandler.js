var express = require('express');
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var request = require('request');


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

// Cannot complete until Will gets Scrape API to work
// The POST object is at the end of this page
exports.articlePost = function(req, res) {
  var doc = null; // need to include doc from form
                  // need to add redirect on sucessful save
  DB.collection('posts').insert(doc, function(err, doc) {
    if(err) throw err;
    
    console.log("Document being inserted: ", doc);
    res.send(200, doc);
    DB.close();
  });
};

// This function needs to eventually limit the number of documents being retrieved and sort those documents
exports.newestHeadlinesGet = function(req, res) {
  DB.collection('posts').find({}).toArray(function(err, docs) {
    if(err) throw err;
    
    console.log("Collection being requested: ", docs);
    res.send(200, docs);
    DB.close();
  });
};


exports.newestHeadlinesPost = function(req, res) {

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


// Scrape object
// {
//   poster    : current_user, 
//   postTitle : input.text.val(), 
//   postSource: scrapped.url, 
//   article   : {
//     title   : scraped.title,
//     image   : scrapped.images[0].url,
//     p1: {
//       currentText : scrapped.text,
//       proposedText: [{
//         editor: "", 
//         text  : "",
//         vote  : ""  
//       }] 
//     }
//   },
//   comments  : [{
//     commentor: "",
//     comment  : ""
//   }] 
// }

exports.articleGet = function(req, res) {
  var url = 'http://www.huffingtonpost.com/2014/04/04/mental-health-fort-hood-shooting-factor_n_5093568.html';
  var apiKey = 'c6da1b5b8fed3a1501866f95ff8fd91c';

  request('http://api.diffbot.com/v2/article?token=' + apiKey + '&url=' + url, function(error, response, body){

    if (!error && response.statusCode == 200) {
      res.send(200, body);
    }
   });

};

