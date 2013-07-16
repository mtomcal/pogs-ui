'use strict';

angular.module('pogsUiApp')
  .controller('MainCtrl', function ($scope, $location, Params) {
    $scope.pogSearch = {};
    $scope.pogSearch.subCellBool = '';
    $scope.pogSearch.nuclearBool = '';
    $scope.pogSearch.ppdbTarget = '';
    $scope.pogSearch.pog = '';

    $scope.pogSearchSubmit = function() {
      Params.clear();
      Params.set({
        gene: $scope.pogSearch.gene,
        tid: $scope.pogSearch.tid,
        domain: $scope.pogSearch.domain,
        pog: $scope.pogSearch.pog,
        type: 'byPOG',
        targetop: $scope.pogSearch.subCellBool,
        nucop: $scope.pogSearch.nuclearBool,
        location: $scope.pogSearch.subCellTarget,
        ppdb: $scope.pogSearch.ppdbTarget,
      });

      $location.path('/search');
    }

  });
