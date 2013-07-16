'use strict';

angular.module('pogsUiApp', ['ui', 'ui.bootstrap', 'ngResource', 'ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/pog/:id', {
        templateUrl: 'views/pog.html',
        controller: 'PogCtrl'
      })
      .when('/mart/:id/:type/:dataset', {
        templateUrl: 'views/mart.html',
        controller: 'MartCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .when('/search/:page', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
