'use strict';

angular.module('newsyApp.controllers.login', ['newsyApp.services.user'])
  .controller('LoginController', ['$scope', 'userService', '$location',
    function($scope, userService, $location) {

      if(!!$scope.auth){
        $location.path('/');
      }

      $scope.$on('angularFireAuth:login', function () {
        $location.path('/');
      })

      $scope.email = null;
      $scope.pass = null;
      $scope.name = null;

      $scope.login = function(callback) {
        $scope.err = null;
        userService.login($scope.email, $scope.pass, '/', function(err, user) {
          $scope.err = err||null;
          typeof(callback) === 'function' && callback(err, user);
        });
      };
    }])
