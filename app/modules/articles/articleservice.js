'use strict';
 
angular.module('newsyApp.services.articles', [])
  .factory('Articles', ['$location',
    function($location) {
      return {
        collection: function(cb) {
          // $http.get('URL')
        }

      , find: function(articleId) {
          // $http.get('URL', {
          //   params.articleId = articleId
          // })
        }
    }
  }])