'use strict';

angular.module('pogsUiApp')
  .controller('SearchCtrl', function ($scope, $location, $routeParams, Params, Search) {


    $scope.$root.$on('Params:set', function () {
      $scope.results = $scope.resolveSearch();
    });

    var genemodel = function ($routeParams) {
      if (!$routeParams.genemodel) {
        return;
      }
      Params.clear('genemodel');
      Params.set('genemodel', {
        tid: $routeParams.genemodel,
        method: 'groups',
        type: 'byPOG',
      });
    }

    genemodel($routeParams);

    $scope.page = parseInt($routeParams.page) || 1; 
    Params.page('pogSearch', $scope.page);
    $scope.total_pages = 0; 
    $scope.loader = true;
    $scope.loadedResults = false;
    $scope.noResults = false;
    $scope.setPage = function (page, url) {
      $location.path('/'+url+'/'+page);
    };
    $scope.pogMethod = function () {
      if (Params.get('pogSearch').pogMethod == 'plaza_groups') {
        return 'plaza'
      }
      return 'pog'
    };

    $scope.resolveSearch = function () {
      return Search.query(Params.get('pogSearch'), function (data) {
        if (data.results.length == 0) {
          $scope.loader = false;
          $scope.noResults = true;
          return;
        }
        if (Object.keys(data.results).length == 1) {
          var keys = Object.keys(data.results);
          if (Params.get('pogSearch').pogMethod == 'plaza_groups') {
            $location.path('/plaza/'+keys[0]);
          } else {
            $location.path('/pog/'+keys[0]);
          }
          return;
        }
        $scope.loader = false;
        $scope.loadedResults = true;
        $scope.total_pages = Math.ceil(data.count / 25);
        return data;
      }, 
      function (fail) {
        $scope.loader = false;
        $scope.noResults = true;
        return;
      });
    };

    $scope.results = $scope.resolveSearch();
  });
