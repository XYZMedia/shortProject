'use strict';
 
angular.module('newsyApp.controllers.onearticle', ['newsyApp.services.articles'])
  .controller('OneArticleController', ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location, Articles) {
    
      $scope.findParagraphs = function(){
        $scope.paragraphs = [];
      }

}])