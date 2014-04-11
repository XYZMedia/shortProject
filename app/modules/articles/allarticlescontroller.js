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
        });
      };

      $scope.findOneArticle = function(articleId) {
        //console.log(articleId);
        //not sure if $rootscope below is necessary or if there's another way to pass the id
        $scope.articleId=articleId;
        $location.path('/article').search({ articleId: $scope.articleId });
      };

    }]);
