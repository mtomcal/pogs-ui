'use strict';

angular.module('pogsUiApp')
  .controller('MainCtrl', function ($scope, $location, Params) {
    $scope.pogSearch = {};
    $scope.pogSearch.subCellBool = '';

    $scope.$watch('pogSearch.predotar + pogSearch.targetp', function () {
      var resolve = function() {
        if ($scope.pogSearch.predotar && $scope.pogSearch.targetp) {
          return 'either';
        }
        if ($scope.pogSearch.predotar) {
          return 'predotar';
        }
        if ($scope.pogSearch.targetp) {
          return 'targetp';
        }
        return '';
      };
      $scope.pogSearch.subCellBool = resolve();
    });
    $scope.pogSearch.genesearch = '';

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

    $scope.pogSearch.nuclearBool = '';

    $scope.$watch('pogSearch.nucpred + pogSearch.predictnls', function() {
      var resolve = function () {
        if ($scope.pogSearch.nucpred && $scope.pogSearch.predictnls) {
          return 'either';
        }
        if ($scope.pogSearch.nucpred) {
          return 'nucpred';
        }
        if ($scope.pogSearch.predictnls) {
          return 'predictnls';
        }
        return '';
      }
      $scope.pogSearch.nuclearBool = resolve();
    });
    $scope.pogSearch.predotar = false;
    $scope.pogSearch.targetp = false;

    $scope.$watch('pogSearch.subCellTarget + pogSearch.predotar + pogSearch.targetp', function() {
      if ($scope.pogSearch.predotar || $scope.pogSearch.targetp) {
        return;
      }
      $scope.pogSearch.subCellTarget = '';
    });
    
    $scope.pogSearch.ppdb = false;
    $scope.pogSearch.ppdbTarget = '';
    $scope.pogSearch.pog = '';
    $scope.pogSearch.pogMethod = 'groups';

    $scope.geneSearch = {};
    $scope.geneSearch.subCellBool = '';
    $scope.geneSearch.nuclearBool = '';
    $scope.geneSearch.ppdbTarget = '';
    $scope.geneSearch.pog = '';

    $scope.reset = function () {
      $scope.pogSearch.targetp = 
      $scope.pogSearch.predotar = 
      $scope.pogSearch.nucpred = 
      $scope.pogSearch.predictnls = 
      $scope.pogSearch.ppdbTarget = 
      $scope.pogSearch.subCellTarget = 
      $scope.pogSearch.pog = 
      $scope.pogSearch.nuclearBool =
      $scope.pogSearch.subCellBool = '';
      $scope.pogSearch.ppdb = false;
    }

    $scope.$watch('pogSearch.ppdb + pogSearch.ppdbTarget', function() {
      if ($scope.pogSearch.ppdb) {
        return;
      }
      $scope.pogSearch.ppdbTarget = '';
    });

    Params.clear('pogSearch');
    $scope.pogSearchSubmit = function() {
      Params.set('pogSearch', {
        gene: $scope.pogSearch.gene,
        tid: $scope.pogSearch.tid,
        domain: $scope.pogSearch.domain,
        pog: $scope.pogSearch.pog,
        type: 'byPOG',
        targetop: $scope.pogSearch.subCellBool,
        nucop: $scope.pogSearch.nuclearBool,
        location: $scope.pogSearch.subCellTarget,
        ppdb: $scope.pogSearch.ppdbTarget,
        pogMethod: $scope.pogSearch.pogMethod
      });

      $location.path('/search');
    }
    Params.clear('pogSearch');
    $scope.geneSearchSubmit = function() {
      Params.set('geneSearch', {
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

    $scope.booleanGuidelines = "<p>For Boolean Searches: <ul style=\"text-align:left;\"><li>Use 'TERM1 AND TERM2' for AND searches</li><li>A space for OR Searches</li><li>Quotes for exact match searches</li></ul></p>";


  });
