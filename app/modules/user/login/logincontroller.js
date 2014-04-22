(function () {
  'use strict';

angular.module('newsyApp.controllers.login', ['newsyApp.services.user'])
  .controller('LoginController', ['$scope', 'userService',
    function ($scope, userService) {
      
      $scope.signup = function () {
        userService.signup($scope.email, $scope.image, $scope.username, $scope.password);
        $scope.email = '';
        $scope.image = '';
        $scope.username = '';
        $scope.password = '';
      };

      $scope.login = function () {
        $scope.err = null;
        userService.login($scope.email, $scope.username, $scope.password);
        $scope.username = '';
        $scope.password = '';
      };
    }
  ]);
}());
