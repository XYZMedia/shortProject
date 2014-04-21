'use strict';

angular.module('newsyApp.controllers.newpost', [])
  .controller('NewPostController', ['$scope', 'Articles',
    function($scope, Articles) {

      $scope.submit = function () {
        Articles.newArticle($scope.url);
      };
}]);
