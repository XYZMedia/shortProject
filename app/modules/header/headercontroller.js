'use strict';

angular.module('newsyApp.controllers.header', [])
  .controller('HeaderController', ['$scope', '$location', 'userService', '$cookieStore', 
    function($scope, $location, userService, $cookieStore) {

      $scope.currentUser = $cookieStore.get('currentUser')

      $scope.getUser = function(){
        if($scope.currentUser.role > 1){
          $scope.authorized = true;
        }
      }

      $scope.logout = function() {
        userService.logout();
        $scope.authorized = false;
      };

      $scope.navbarEntries = [
        {
          "title": "Breaking News",
          "link": "/breakingnews"
        }, {
          "title": "Tech",
          "link": "/tech"
        }, {
          "title": "Science",
          "link": "/science"
        }, {
          "title": "Business",
          "link": "/business"
        }
      ];

      $scope.$on('$routeChangeSuccess', function() {
        $scope.navbarEntries.forEach(
          function(data) {
            data.isActive = ($location.path().indexOf(data.link) == 0);
          }
        )
      })

    }])
