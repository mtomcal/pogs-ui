'use strict';

angular.module('pogsUiApp')
  .controller('QuickSearch', function ($scope, $location, Params) {

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
      Params.clear();
      Params.set({
        gene: $scope.pogSearch.gene,
        tid: $scope.pogSearch.tid,
        type: 'byPOG',
        pogMethod: $scope.pogSearch.pogMethod
      });
      $location.path('/search');
    }
  });
