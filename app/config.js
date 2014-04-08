'use strict';

// Declare app level module which depends on filters, and services
angular.module('newsyApp.config', ['ngCookies'])

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    
      var access = routingConfig.accessLevels;
      
      $routeProvider
      .when('/',
              { 
                templateUrl: 'modules/articles/allarticles.html',
                access: access.anon
              }
      )
      //consolidate all routes to use location variables
      
      .when('/breakingnews',
              {
               templateUrl: 'modules/articles/allarticles.html',
               access: access.anon
              }
      )
      
      .when('/tech',
              { 
                templateUrl: 'modules/articles/allarticles.html',
                access: access.anon
              }
      )
      
      .when('/science',
              {
               templateUrl: 'modules/articles/allarticles.html',
               access: access.anon
              }
      )
      
      .when('/science/article1',
              { 
                templateUrl: 'modules/articles/onearticle.html',
                access: access.anon
              }
      )

      .when('/business',
              {
               templateUrl: 'modules/articles/allarticles.html',
               access: access.anon
              }
      )

      .when('/newpost',
              {
               templateUrl: 'modules/articles/newpost.html',
               access: access.user
              }
      )

      .when('/login',
              { 
                templateUrl: 'modules/user/login/login.html',
                access: access.anon
               }
      )

      .when('/signup',
             {
              templateUrl: 'modules/user/login/signup.html',
              access: access.anon
             }
      )
      
      .otherwise({ redirectTo: '/' });






    // $routeProvider.when('/private',
    //     {
    //         templateUrl:    'partials/private',
    //         controller:     PrivateCtrl,
    //         access:         access.user
    //     });
    // $routeProvider.when('/admin',
    //     {
    //         templateUrl:    'partials/admin',
    //         controller:     AdminCtrl,
    //         access:         access.admin
    //     });



    }])


  
  // establish user authentication
  // .run(['angularFireAuth', 'FBURL', '$rootScope', 
  //   function(angularFireAuth, FBURL, $rootScope) {
  //     angularFireAuth.initialize(new Firebase(FBURL), {scope: $rootScope, name: 'auth', path: '/signin'});
  //     $rootScope.FBURL = FBURL;
  //   }])