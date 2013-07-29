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
      .when('/search/genemodel/:genemodel', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .when('/genesearch', {
        templateUrl: 'views/genesearch.html',
        controller: 'SearchCtrl',
      })
      .when('/genesearch/:page', {
        templateUrl: 'views/genesearch.html',
        controller: 'SearchCtrl',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
      })
      .when('/plaza/:id', {
        templateUrl: 'views/plaza.html',
        controller: 'PlazaCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
angular.module('pogsUiApp').constant('BASE_URL', '/ui/');
