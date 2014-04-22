'use strict';

// Declare app level module which depends on filters, and services
angular.module('newsyApp.config', ['ngCookies', 'xeditable'])

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

      .when('/article',
              {
               templateUrl: 'modules/articles/onearticle.html',
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
    }
]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

app.run(['$rootScope', '$location', '$cookieStore', 'userService', function ($rootScope, $location, $cookieStore, userService, editableOptions) {
    $rootScope.$on("$routeChangeStart", function (event, next, currentUser) {
      var currentUser = $cookieStore.get('currentUser') || {role: 1};
        if (!userService.isAuthorized(next.access, currentUser.role)) {
            if(userService.isLoggedIn(currentUser)){
              $location.path('/');
            }else{
              $location.path('/login');
            }
        }
    });
    $rootScope.$on('invalidSignUp', function(event, message){
      alert(message);
    });
    $rootScope.$on('invalidLogIn', function(event, message){
      alert(message);
    });
}]);
