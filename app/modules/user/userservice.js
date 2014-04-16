'use strict';

angular.module('newsyApp.services.user', [])
  .factory('userService', ['$location', '$rootScope', '$http', '$cookieStore', '$window',
//EUGENECHOI
    function($location, $rootScope, $http, $cookieStore, $window) {
      var access = routingConfig.accessLevels;
      var role = routingConfig.userRoles;
      var currentUser = $cookieStore.get('currentUser') || { username: '', role: role.public };

      var user = {

        isAuthorized: function(accessLevel, userRole){
          if(userRole === 'undefined'){
            userRole = currentUser.role;
          }
          return (accessLevel <= userRole);
        },

        isLoggedIn: function(currentUser){
          return currentUser.role >= role.user;
        },

        signup: function(email, image, username, password) {
          var userInfo = {
            email: email,
            image: image,
            username: username,
            password: password,
            role: role.public
          }

          $http.post('/signup', userInfo)
            .success(function(res){ // res contains userInfo with updated role
              if(res === 'false'){  //signup failed
                $location.path('/signup'); // ASK
              }else{
                $location.path('/');
              }

            });

        },

        login: function(email, username, password) {
          var userInfo = {
            email: email,
            username: username,
            password: password,
            role: role.public
          };

          $http.post('/login', userInfo)
            .success(function(res){ // res contains userInfo with updated role
              if(res === ''){
                //user info does not match
              }else{
                $location.path('/');
              }
            });
            
        },

        logout: function() {
          $cookieStore.remove('currentUser');
          $cookieStore.put( 'currentUser', { role: 1 } );
          //send logout request to server
          $location.path('/');
        },

        newArticle: function(url){
          $http.post('/newpost', {url: url})
            .success(function(res){
              $rootScope.articleId = JSON.parse(res);
              $location.path('/article').search({ articleId: $rootScope.articleId });

            });
        }



      };

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
