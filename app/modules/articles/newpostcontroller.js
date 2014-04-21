'use strict';

angular.module('newsyApp.controllers.newpost', [])
  .controller('NewPostController', ['$scope','$routeParams', '$location', 'Articles', 'userService',
    function($scope, $routeParams, $location, Articles, userService) {

      $scope.submit = function() {
        userService.newArticle($scope.url);
      };
}]);
