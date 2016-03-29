import angular from 'angular';
import 'angular-ui-router';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-ui-bootstrap';
import pogController from './controllers/pog';

angular.module('pogsUiApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngSanitize'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('/', {
        template: require('./views/main.html'),
        controller: 'MainCtrl'
      })
      .state('pog', {
        url: '/pog/:id',
        template: require('./views/pog.html'),
        controller: pogController
      })
      .state('/mart/:id/:type/:dataset/:ortho', {
        template: require('./views/mart.html'),
        controller: 'MartCtrl'
      })
      .state('/search', {
        template: require('./views/search.html'),
        controller: 'SearchCtrl'
      })
      .state('/search/:page', {
        template: require('./views/search.html'),
        controller: 'SearchCtrl'
      })
      .state('/search/genemodel/:genemodel', {
        template: require('./views/search.html'),
        controller: 'SearchCtrl'
      })
      .state('/search/:method/genemodel/:genemodel', {
        template: require('./views/search.html'),
        controller: 'SearchCtrl'
      })
      .state('/genesearch', {
        template: require('./views/genesearch.html'),
        controller: 'SearchCtrl'
      })
      .state('/genesearch/:page', {
        template: require('./views/genesearch.html'),
        controller: 'SearchCtrl'
      })
      .state('/about', {
        template: require('./views/about.html'),
        controller: 'AboutCtrl'
      })
      .state('/plaza/:id', {
        template: require('./views/plaza.html'),
        controller: 'PlazaCtrl'
      })
      .state('/blast', {
        template: require('./views/blast.html'),
        controller: 'BlastCtrl'
      });
  });
angular.module('pogsUiApp').constant('BASE_URL', '/');
