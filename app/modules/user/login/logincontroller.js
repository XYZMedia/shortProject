'use strict';

angular.module('newsyApp.controllers.login', ['newsyApp.services.user'])
  .controller('LoginController', ['$scope', 'userService', '$location', '$route',
    function($scope, userService, $location, $route) {

      $scope.signup = function(callback) {
        userService.signup($scope.email, $scope.username, $scope.password);
      };

      $scope.login = function(callback) {
        console.log($scope.username);
        $scope.err = null;
        userService.login($scope.email, $scope.username, $scope.password)
      };

    }])
