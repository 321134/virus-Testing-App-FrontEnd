'use strict';

/**
 * @ngdoc overview
 * @name frontEndApp
 * @description
 * # frontEndApp
 *
 * Main module of the application.
 */
angular
  .module('frontEndApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngDialog',
    'ngFileUpload'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
    .state('app', {
        url:'/',
        views: {
          'header': {
              templateUrl : 'views/header.html'
          },
          'content': {
            templateUrl : 'views/main.html',
            controller  : 'MainCtrl'
          },
          'footer': {
              templateUrl : 'views/footer.html'
          }
        }
      })
    //route for data page
    .state('app.data', {
      url:'data',
      views: {
        'content@': {
          templateUrl: 'views/data.html',
          controller: 'DataController'
        }
      }
    });

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('APIInterceptor');
  });
