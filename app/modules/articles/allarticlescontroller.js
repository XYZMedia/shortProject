(function () {
  'use strict';

angular.module('newsyApp.controllers.allarticles', [])
  .controller('AllArticlesController', ['$scope', '$location', 'Articles',
    function ($scope, $location, Articles) {

      $scope.findArticles = function () {
        Articles.collection(function (res) {
          $scope.articles = res;
        });
      };

      $scope.findOneArticle = function (articleId) {
        $scope.articleId = articleId;
        $location.path('/article').search({ articleId: $scope.articleId });
      };

    }]);
}());
