'use strict';

angular.module('newsyApp.controllers.allarticles', ['newsyApp.services.articles'])
  .controller('AllArticlesController', ['$scope','$routeParams', '$location', 'Articles',
    function($scope, $routeParams, $location, Articles) {

      $scope.findArticles = function() {
        Articles.collection(function(res){
          $scope.articles = res;

        });
      };

      $scope.findOneArticle = function(articleId) {
        $scope.articleId=articleId;
        $location.path('/article').search({ articleId: $scope.articleId });
      };

    }]);
