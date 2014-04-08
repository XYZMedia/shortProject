'use strict';

angular.module('newsyApp.services.user', [])
  .factory('userService', ['$location', '$rootScope', '$cookieStore', '$http',
    function($location, $rootScope, $cookieStore, $http) {
      
    var accessLevels = routingConfig.accessLevels,
        userRoles = routingConfig.userRoles,
        currentUser = $cookieStore.get('user')|| { username: '', role: userRoles.public };

    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;

      return {
        authorize: function(accessLevel, role){
          if(role === undefined){
            role - currentUser.role;
          }
          return accessLevel.bitMask & role.bitMask;
        },
        
        login: function(email, username, password) {
          var user = {
            username: username,

          }
          //send login request to server
            $http.post('/login', email).success(function(email){
              console.log(email + username + password)
            });
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
