'use strict';

angular.module('pogsUiApp')
  .controller('MainCtrl', function ($scope, $location, Params) {
    $scope.pogSearch = {};
    $scope.pogSearch.subCellBool = '';
    $scope.pogSearch.nuclearBool = '';
    $scope.pogSearch.ppdbTarget = '';
    $scope.pogSearch.pog = '';

    $scope.geneSearch = {};
    $scope.geneSearch.subCellBool = '';
    $scope.geneSearch.nuclearBool = '';
    $scope.geneSearch.ppdbTarget = '';
    $scope.geneSearch.pog = '';

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
    $scope.geneSearchSubmit = function() {
      Params.clear();
      Params.set({
        gene: $scope.geneSearch.gene,
        tid: $scope.geneSearch.tid,
        domain: $scope.geneSearch.domain,
        pog: $scope.geneSearch.pog,
        type: 'byGene',
        targetop: $scope.geneSearch.subCellBool,
        nucop: $scope.geneSearch.nuclearBool,
        location: $scope.geneSearch.subCellTarget,
        ppdb: $scope.geneSearch.ppdbTarget,
      });

      $location.path('/genesearch');
    }


  });
