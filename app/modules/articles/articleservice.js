'use strict';

angular.module('newsyApp.services.articles', [])
  .factory('Articles', ['$location', '$http',
    function($location, $http) {
      return {
        collection: function(cb) {
          $http.get('/articles')
            .success(function(res){
              console.log('get request success:' + res);
              cb(res);
            });
        }

      , find: function(articleId, cb) {
          $http.get('/getArticle', {
            params: {id : articleId}
          }).success(function(res){
            console.log('getArticle request success:' + res);
            cb(res);
          })
        }

      , voteUp: function(articleId, paragraphIndex, editIndex) {
        $http.post('', {
          
        })
      }

      , getTweets: function(hashtags, cb) {
          console.log("sup");
          $http.post('/getTweets', {
            data: {hashtags : hashtags}
          }).success(function(res){
            console.log('getTweets request success:' + res);
            cb(res);
          }).error(function(res){
            console.log('getTweets error:' + res);
            cb(res);
          })
        }
    }
  }])
