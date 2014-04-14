'use strict';
angular.module('newsyApp')  
  .factory('Auth', function($http, $rootScope, $cookieStore){

    var currentUser = $cookieStore.get('currentUser');

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;
            return accessLevel &amp; role;
        },

        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role === userRoles.user || user.role === userRoles.admin;
        },

        signup: function(user, success, error) {
            console.log('user is', user)
            $http.post('/signup', user).success(function(user){
                console.log('signup request successful')
                console.log('response to signup is ', user);
            }).error(error);
        },

        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                currentUser = user;
                success(user);
            }).error(error);
        },

        logout: function(success, error) {
            $http.post('/logout').success(function(){
                currentUser = {
                    username : '',
                    role : userRoles.public
                };
                success();
            }).error(error);
        },

        accessLevels: accessLevels,
        userRoles: userRoles
    };
});
