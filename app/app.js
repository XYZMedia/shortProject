'use strict';
 
// Declare app level module which depends on filters, and services
var app = angular.module('newsyApp',
  [ 'newsyApp.config'
  , 'newsyApp.controllers.header'
  , 'newsyApp.controllers.login'
  , 'newsyApp.controllers.profile'
  , 'newsyApp.controllers.onearticle'
  , 'newsyApp.controllers.allarticles'
  , 'newsyApp.controllers.newpost'
  , 'ui.bootstrap'
  , 'xeditable'
  , 'ngCookies'
  , 'ngRoute'
  ])
