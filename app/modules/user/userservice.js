'use strict';

angular.module('newsyApp.services.user', [])
  .factory('userService', ['$location', '$rootScope',
    function($location, $rootScope) {
      return {
        login: function(email, pass, redirect, callback) {
          //send login request to server
        },
        logout: function(redirectPath) {
          //send logout request to server
          if(redirectPath) {
            $location.path(redirectPath);
          }
        },
        createAccount: function(name, email, pass, callback) {
      
        }
    }
  }])