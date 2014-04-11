'use strict';

angular.module('newsyApp.controllers.allarticles', ['newsyApp.services.articles'])
  .controller('AllArticlesController', ['$scope','$routeParams', '$location', 'Articles',
    function($scope, $routeParams, $location, Articles) {

      $scope.test = function(index){
        // console.log($scope.articles[index].poster)
        $location.path('/science/article1');
      };

      $scope.findArticles = function() {
        Articles.collection(function(res){
          $scope.articles = res;
          console.log('scope.articles is, ', $scope.articles);

        });
      };

      $scope.findOneArticle = function (articleId) {
        //reroute to new article on selection
      };

    }]);
