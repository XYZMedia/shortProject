'use strict';

angular.module('newsyApp.services.user', [])
  .factory('userService', ['$location', '$rootScope', '$http', '$cookieStore',
//EUGENECHOI
    function($location, $rootScope, $http, $cookieStore) {
      var access = routingConfig.accessLevels;
      var role = routingConfig.userRoles;
      var currentUser = $cookieStore.get('userInfo') || { username: '', role: role.public };
      
      var user = {

        isAuthorized: function(accessLevel, userRole){
          if(userRole === 'undefined'){
            userRole = $rootScope.currentUser.role;
          }
          return (accessLevel <= userRole);
        },

        isLoggedIn: function(currentUser){
          return currentUser.role >= role.user;
        },

        signup: function(email, username, password) {
          var userInfo = {
            email: email,
            username: username,
            password: password,
            role: role.public
          }
          
          $http.post('/signup', userInfo)
            .success(function(res){ // res contains userInfo with updated role
              $rootScope.currentUser = res;
              console.log($rootScope.currentUser);
              $location.path('/')
            });

          //send login request to server
        },

        login: function(email, username, password) {
          console.log($cookieStore.get('userInfo'))
          var userInfo = {
            email: email,
            username: username,
            password: password,
            role: role.public
          }
          
          $http.post('/login', userInfo)
            .success(function(res){ // res contains userInfo with updated role
              console.log("success login");
              $rootScope.currentUser = res;
              console.log($rootScope.currentUser);
              $location.path('/')
            });

          //send login request to server
        },

        logout: function(redirectPath) {
          $rootScope.currentUser = {};
          //send logout request to server
          if(redirectPath) {
            $location.path(redirectPath);
          }
        },

        createAccount: function(name, email, pass, callback) {
      
        },
        

      }

       user.whenLoggedIn = $http.get('user.json')
          .then(function(response){
          // Check to see if there is an error.
          if (response.data.error !== undefined) {
            // should be more thorough with this check to determine the 
            // correct action (examine the error)
            user.loggedIn = false;
          }else{
            user.loggedIn = true;
            user.details = response.data;
            return user;
          } 

        }).then;

      return user;

    }]);






    // NOTE: I am assigning the "then" function of the login promise to 
    // "whenLoggedIn" - your controller code is then very easy to read.
  //     return {