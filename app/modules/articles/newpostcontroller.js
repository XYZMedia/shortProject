'use strict';

angular.module('newsyApp.controllers.newpost', ['newsyApp.services.articles', 'newsyApp.services.user'])
  .controller('NewPostController', ['$scope','$routeParams', '$location', 'Articles', 'userService',
    function($scope, $routeParams, $location, Articles, userService) {

      $scope.submit = function() {
        userService.newArticle($scope.url);
      };
}]);
