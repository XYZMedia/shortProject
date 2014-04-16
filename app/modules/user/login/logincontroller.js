'use strict';

angular.module('newsyApp.controllers.login', ['newsyApp.services.user'])
  .controller('LoginController', ['$scope', 'userService', '$location',
    function($scope, userService, $location) {

      if(!!$scope.auth){
        $location.path('/');
      }

      $scope.signup = function() {
        userService.signup($scope.email, $scope.image, $scope.username, $scope.password);
      };

      $scope.login = function() {
        $scope.err = null;
        userService.login($scope.email, $scope.username, $scope.password)
      };

    }])
