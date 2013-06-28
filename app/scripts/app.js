'use strict';

angular.module('pogsUiApp', ['ui', 'ui.bootstrap', 'ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/pog/:id', {
        templateUrl: 'views/pog.html',
        controller: 'PogCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
