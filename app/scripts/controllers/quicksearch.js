'use strict';

angular.module('pogsUiApp')
  .controller('QuickSearch', function ($scope, $location, Params, $route) {

    window.myscope = $scope;
    $scope.pogSearch = {};

    $scope.pogSearch.genesearch = '';
    $scope.pogSearch.tid = '';
    $scope.pogSearch.gene = '';
    $scope.pogSearch.pogMethod = 'groups';


    $scope.$watch('pogSearch.genesearch', function() {
      var resolve = function() {
        if ($scope.pogSearch.genesearch.match(/(\_|\.){1}/)) {
          $scope.pogSearch.tid = $scope.pogSearch.genesearch;
          $scope.pogSearch.gene = '';
          return;
        }
        $scope.pogSearch.tid = '';
        $scope.pogSearch.gene = $scope.pogSearch.genesearch;
      };
      resolve();
    });

    $scope.pogSearchSubmit = function() {
      Params.clear('pogSearch');
      Params.set('pogSearch', {
        gene: $scope.pogSearch.gene,
        tid: $scope.pogSearch.tid,
        type: 'byPOG',
        pogMethod: $scope.pogSearch.pogMethod
      });
      if ($location.path() == '/search') {
        $route.reload();
        return;
      }
      $location.path('/search');
    }
  });
