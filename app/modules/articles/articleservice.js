'use strict';
 
angular.module('newsyApp.services.articles', [])
  .factory('Articles', ['$location', 
    function($location) {
      return {
        collection: function(cb) {
          // return all articles
        }
      , find: function(articleId) {
          // return one article
        }
    }
  }])