'use strict';

angular.module('newsyApp.services.user', [])
  .factory('userService', ['$location', '$rootScope', '$cookieStore', '$http',
    function($location, $rootScope, $cookieStore, $http) {
      
    var accessLevels = routingConfig.accessLevels,
        userRoles = routingConfig.userRoles,
        currentUser = $cookieStore.get('user');

    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;

      return {
        login: function(email, pass, redirect, callback) {
          //send login request to server
            $http.get(redirect, email).success(function(email){
              $rootScope.user = email;
              success(email);
            }).error(function(){console.log('ef')});
        },

        logout: function(redirectPath) {
          //send logout request to server
          if(redirectPath) {
            $location.path(redirectPath);
          }
        },
        createAccount: function(name, email, pass, callback) {
      
        },

        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    }
  }])
