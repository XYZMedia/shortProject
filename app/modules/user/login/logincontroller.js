'use strict';

angular.module('newsyApp.controllers.login', ['newsyApp.services.user'])
  .controller('LoginController', ['$scope', 'userService', '$location',
    function($scope, userService, $location) {

      if(!!$scope.auth){
        $location.path('/');
      }

      // $scope.$on('angularFireAuth:login', function () {
      //   $location.path('/');
      // })

      // $scope.email = null;
      // $scope.pass = null;
      // $scope.name = null;

      $scope.signup = function(callback) {
        userService.signup($scope.email, $scope.username, $scope.password);
      };

      $scope.login = function(callback) {
        console.log($scope.username)
        $scope.err = null;
        userService.login($scope.email, $scope.username, $scope.password)
         // '/', function(err, user) {
         //  $scope.err = err||null;
         //  typeof(callback) === 'function' && callback(err, user);
        // });
      };
    }])
