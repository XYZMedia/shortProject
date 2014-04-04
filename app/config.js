'use strict';

// Declare app level module which depends on filters, and services
angular.module('newsyApp.config', [])

app.config(['$routeProvider', 
    function($routeProvider) {
      $routeProvider
      .when('/',        { templateUrl: 'modules/articles/allarticles.html' })
      .when('/newpost',  { templateUrl: 'modules/articles/newpost.html' })
      .when('/login',  { templateUrl: 'modules/user/login/login.html' })
      .when('/signup',  { templateUrl: 'modules/user/login/signup.html' })
      .otherwise({ redirectTo: '/' });
    }])
  
  // establish user authentication
  // .run(['angularFireAuth', 'FBURL', '$rootScope', 
  //   function(angularFireAuth, FBURL, $rootScope) {
  //     angularFireAuth.initialize(new Firebase(FBURL), {scope: $rootScope, name: 'auth', path: '/signin'});
  //     $rootScope.FBURL = FBURL;
  //   }])