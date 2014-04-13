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
    }
  }])
