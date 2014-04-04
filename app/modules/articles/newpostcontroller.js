'use strict';
 
angular.module('newsyApp.controllers.newpost', ['newsyApp.services.articles'])
  .controller('NewPostController', ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location, Articles) {
    
      $scope.submit = function() {
        console.log('submit works')
      }

}])