'use strict';
 
angular.module('newsyApp.controllers.newpost', ['newsyApp.services.articles'])
  .controller('NewPostController', ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location, Articles) {

      $scope.addHTTP = function(){
        if($scope.url === undefined || $scope.url.charAt(0) !== 'h'){
          $scope.url = 'http://'
        }
      }

      $scope.removeHTTP = function(){
        if($scope.url === 'http://'){
          $scope.url = ''
        }
      }

      $scope.submit = function() {
        if(asfd){

        }
        // if($scope.url.charAt(0) === "w"){
        //   $scope.url = "http://" + $scope.url
        // }
        console.log('submit works')
      }

}])