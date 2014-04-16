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
        var paragraphInfo = {
          articleId: articleId,
          paragraphIndex: paragraphIndex,
          editIndex: editIndex
        }
        $http.post('/voteUp', paragraphInfo)
           .success(function(res){})
      }

      , replaceParagraph: function(articleId, paragraphIndex, editIndex, user) {
        var paragraphInfo = {
          articleId: articleId,
          paragraphIndex: paragraphIndex,
          editIndex: editIndex,
          user: user
        }
        console.log('paragraphInfo is, ', paragraphInfo);
        $http.post('/edit', paragraphInfo)
           .success(function(res){})
      }

      , newEdit: function(articleId, paragraphIndex, newEditText, source, user) {
        var paragraphInfo = {
          articleId: articleId,
          paragraphIndex: paragraphIndex,
          newEditText: newEditText,
          sources: [source],
          user: user
        }
        console.log(paragraphInfo)
        $http.post('/newEdit', paragraphInfo)
           .success(function(res){})
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
