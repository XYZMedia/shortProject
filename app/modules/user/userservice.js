(function () {
  'use strict';

angular.module('newsyApp.services.user', [])
  .factory('userService', ['$location', '$rootScope', '$http', '$cookieStore',
    function ($location, $rootScope, $http, $cookieStore) {
      var access      = routingConfig.accessLevels,
          role        = routingConfig.userRoles,
          currentUser = $cookieStore.get('currentUser') || { username: '', role: role.public };

      return {
        isAuthorized: function (accessLevel, userRole) {
          if (userRole === 'undefined') {
            userRole = currentUser.role;
          }
          return (accessLevel <= userRole);
        },

        isLoggedIn: function (currentUser) {
          return currentUser.role >= role.user;
        },

        signup: function (email, image, username, password) {
          var userInfo = {
            email: email,
            image: image,
            username: username,
            password: password,
            role: role.public
          };

          $http.post('/signup', userInfo)
            .success(function (res) { // res contains userInfo with updated role
              if (res === 'false') {  //signup failed
                $rootScope.$broadcast('invalidSignUp', 'the username you provided is already in use. please provide a new username to continue');
              } else {
                $location.path('/');
              }

            });

        },

        login: function (email, username, password) {
          var userInfo = {
            email: email,
            username: username,
            password: password,
            role: role.public
          };

          $http.post('/login', userInfo)
            .success(function (res) {
              if (res === '') {
                $rootScope.$broadcast('invalidLogIn', 'Username and password do not match or you do not have an account yet.');
              } else {
                $location.path('/');
              }
            });
            
        },

        logout: function () {
          $cookieStore.remove('currentUser');
          $cookieStore.put( 'currentUser', { role: 1 } );
          $location.path('/');
        },

        newArticle: function (url) {
          $http.post('/newpost', {url: url})
            .success(function(res){
              $rootScope.articleId = JSON.parse(res);
              $location.path('/article').search({ articleId: $rootScope.articleId });
            });
        }
      };
    }]);
}());
