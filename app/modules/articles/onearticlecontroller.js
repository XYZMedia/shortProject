'use strict';
 
angular.module('newsyApp.controllers.onearticle', ['newsyApp.services.articles'])
  .controller('OneArticleController', ['$scope','$routeParams', '$location', '$modal', '$log',
    function($scope, $routeParams, $location, $modal, $log, Articles) {
    
      $scope.findParagraphs = function(){
        $scope.paragraphs = [];
      }

      $scope.sampleData = function() {
        $scope.sampleData = [
        "A ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "B ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "C ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      ]}

//==========Modal Functionality===========
      //function to open the modal
      $scope.editParagraph = function(currentText) {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          resolve: {
            currentText: function () {
              return currentText;
            },
            items: function () {
              return $scope.sampleData;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    //function to create the modal that gets displayed
    var ModalInstanceCtrl = function ($scope, $modalInstance, currentText, items) {

      $scope.currentText = currentText;
      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };

      $scope.voteUp = function(){
        console.log('up!')
      }

      $scope.voteDown = function(){
        console.log('down!')
      }

      $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

}])