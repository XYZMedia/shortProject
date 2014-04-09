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

      , find: function(articleId) {
          // $http.get('URL', {
          //   params.articleId = articleId
          // })
        }
    }
  }])
