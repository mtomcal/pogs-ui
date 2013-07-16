'use strict';

angular.module('pogsUiApp')
  .controller('SearchCtrl', function ($scope, $location, $routeParams, Params, Search) {

    var genemodel = function ($routeParams) {
      if (!$routeParams.genemodel) {
        return;
      }
      Params.clear();
      Params.set({
        tid: $routeParams.genemodel,
        type: 'byPOG',
      });
    }

    genemodel($routeParams);

    $scope.page = parseInt($routeParams.page) || 1; 
    Params.page($scope.page);
    $scope.total_pages = 0; 
    $scope.loader = true;
    $scope.loadedResults = false;
    $scope.noResults = false;
    $scope.setPage = function (page, url) {
      $location.path('/'+url+'/'+page);
    };
    $scope.results = Search.query(Params.get(), function (data) {
      if (data.results.length == 0) {
        $scope.loader = false;
        $scope.noResults = true;
        return;
      }
      if (Object.keys(data.results).length == 1) {
        var keys = Object.keys(data.results);
        $location.path('/pog/'+keys[0]);
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
  });
