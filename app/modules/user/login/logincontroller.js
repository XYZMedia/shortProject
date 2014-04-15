'use strict';

angular.module('newsyApp.controllers.login', ['newsyApp.services.user'])
  .controller('LoginController', ['$scope', 'userService', '$location',
    function($scope, userService, $location) {

      if(!!$scope.auth){
        $location.path('/');
      }

  //EUGENECHOI
      $scope.signup = function(callback) {
        userService.signup($scope.email, $scope.username, $scope.password);
      };

      $scope.login = function(callback) {
        $scope.err = null;
        userService.login($scope.email, $scope.username, $scope.password)
      };

    }])
