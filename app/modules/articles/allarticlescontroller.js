'use strict';
 
angular.module('newsyApp.controllers.allarticles', ['newsyApp.services.articles'])
  .controller('AllArticlesController', ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location, Articles) {
    
      $scope.findArticles = function() {
        $scope.articles = Articles.collection();
      }
 
      $scope.findOneArticle = function (articleId) {
        //reroute to new article on selection
      }

}])