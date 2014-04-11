'use strict';

// Declare app level module which depends on filters, and services
angular.module('newsyApp.config', ['ngCookies', 'xeditable'])

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

      var access = routingConfig.accessLevels;
      //EUGENECHOI
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
//EUGENECHOI
app.run(['$rootScope', '$location', '$cookieStore', 'userService', function ($rootScope, $location, $cookieStore, userService, editableOptions) {
    $rootScope.$on("$routeChangeStart", function (event, next, currentUser) {
      var currentUser = $cookieStore.get('currentUser') || {role: 1};
      console.log('cookie store has', $cookieStore.get('currentUser'));
      console.log('currentUser is,', currentUser);
        if (!userService.isAuthorized(next.access, currentUser.role)) {
            if(userService.isLoggedIn(currentUser)){
              $location.path('/');
            }else{
              $location.path('/login');
            }
        }
    });
}]);









//             $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
//             event.preventDefault();

//             if(fromState.url === '^') {
//                 if(Auth.isLoggedIn()) {
//                     $state.go('user.home');
//                 } else {
//                     $rootScope.error = null;
//                     $state.go('anon.login');
//                 }
//             }
//         }
//     });

// }]);






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

  // establish user authentication
  // .run(['angularFireAuth', 'FBURL', '$rootScope',
  //   function(angularFireAuth, FBURL, $rootScope) {
  //     angularFireAuth.initialize(new Firebase(FBURL), {scope: $rootScope, name: 'auth', path: '/signin'});
  //     $rootScope.FBURL = FBURL;
  //   }])
