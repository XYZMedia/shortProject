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

      , replaceParagraph: function(articleId, paragraphIndex, editIndex) {
        var paragraphInfo = {
          articleId: articleId,
          paragraphIndex: paragraphIndex,
          editIndex: editIndex
        }
        $http.post('/edit', paragraphInfo)
           .success(function(res){})
      }

      , newEdit: function(articleId, paragraphIndex, newEditText, source) {
        var paragraphInfo = {
          articleId: articleId,
          paragraphIndex: paragraphIndex,
          newEditText: newEditText,
          sources: [source]
        }
        $http.post('/newEdit', paragraphInfo)
           .success(function(res){})
      }
    }
  }])
