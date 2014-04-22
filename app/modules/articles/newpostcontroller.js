(function () {
  'use strict';

angular.module('newsyApp.controllers.newpost', [])
  .controller('NewPostController', ['$scope', 'Articles',
    function($scope, Articles) {

      $scope.showLoading = false;

      $scope.submit = function () {
        $scope.showLoading = true;
        Articles.newArticle($scope.url);
      };
}]);
}());
