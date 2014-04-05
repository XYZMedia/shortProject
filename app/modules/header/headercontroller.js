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