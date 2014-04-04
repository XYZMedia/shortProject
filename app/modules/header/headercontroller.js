'use strict';

angular.module('newsyApp.controllers.header', ['newsyApp.services.user'])
  .controller('HeaderController', ['$scope', '$location', 'userService', 
    function($scope, $location, loginService) {

      // $scope.$on('angularFireAuth:login', function() {
      //   angularFire(new Firebase(FBURL+'/users/'+$scope.auth.id), $scope, 'user');
      // });

      $scope.logout = function() {
        loginService.logout('/login');
      };

      // $scope.$on( click add active class)

    }])