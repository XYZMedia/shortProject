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
              if(res === 'false'){  //signup failed
                console.log('not new')
                $location.path('/signup'); // ASK
              }else{
                console.log('on successful sign up, ', res);
                $rootScope.currentUser = res;
                $location.path('/'); 
              }
              
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
              console.log('login post request response is, ', res);
              if(res === ''){
                //user info does not match
                console.log('user info does not match! make sure your username and password is correct');
              }else{
                console.log("success login");
                $rootScope.currentUser = res;
                console.log($rootScope.currentUser);
                $location.path('/')
              }
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

        newArticle: function(url){
          $http.post('/newpost', {url: url})
            .success(function(res){
              console.log(res);
            })
        }

        

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