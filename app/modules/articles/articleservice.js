'use strict';

angular.module('newsyApp.services.articles', [])
  .factory('Articles', ['$http', '$rootScope', '$location', 
    function ($http, $rootScope, $location) {
      return {
        collection: function (cb) {
          $http.get('/articles')
            .success(function (res) {
              cb(res);
            });
        },

        find: function (articleId, cb) {
          $http.get('/getArticle', {
            params: {id : articleId}
          }).success(function (res) {
            cb(res);
          });
        },

        newArticle: function(url){
          $http.post('/newpost', {url: url})
            .success(function(res){
              $rootScope.articleId = JSON.parse(res);
              $location.path('/article').search({ articleId: $rootScope.articleId });

            });
        },

        voteUp: function (articleId, paragraphIndex, editIndex) {
          var paragraphInfo = {
            articleId: articleId,
            paragraphIndex: paragraphIndex,
            editIndex: editIndex
          };
          $http.post('/voteUp', paragraphInfo)
             .success(function (res) {});
        },

        replaceParagraph: function (articleId, paragraphIndex, editIndex, user) {
          var paragraphInfo = {
            articleId: articleId,
            paragraphIndex: paragraphIndex,
            editIndex: editIndex,
            user: user
          };
          $http.post('/edit', paragraphInfo)
             .success(function (res) {});
        },

        newEdit: function (articleId, paragraphIndex, newEditText, source, user) {
          var paragraphInfo = {
            articleId: articleId,
            paragraphIndex: paragraphIndex,
            newEditText: newEditText,
            sources: [source],
            user: user
          };
          $http.post('/newEdit', paragraphInfo)
             .success(function (res) {});
        },

        replaceHashtags: function (articleId, hashtags) {
          var tagObject = {
            articleId : articleId,
            hashtags  : hashtags
          };
          $http.post('/hashtags', tagObject)
            .success(function (res) {});
        },

        getTweets: function (hashtags, cb) {
          $http.post('/getTweets', {
            data: {hashtags : hashtags}
          }).success(function (res) {
            cb(res);
          }).error(function (res) {
            cb(res);
          });
        }
      };
  }])
