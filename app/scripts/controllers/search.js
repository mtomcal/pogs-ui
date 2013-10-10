'use strict';

angular.module('pogsUiApp')
  .controller('SearchCtrl', function ($scope, $location, $routeParams, BASE_URL, Params, Search) {

    $scope.BASE_URL = BASE_URL;

    var searchChannel = 'pogSearch';

    var genemodel = function ($routeParams) {
      if (!$routeParams.genemodel) {
        return;
      }
      var method = "groups";
      searchChannel = 'genemodel';
      if ($routeParams.method == 'plaza') {
        method = $routeParams.method + "_groups";
      }
      Params.clear('genemodel');
      Params.set('genemodel', {
        tid: $routeParams.genemodel,
        pogMethod: method,
        type: 'byPOG',
      });
    }

    genemodel($routeParams);

    $scope.page = parseInt($routeParams.page) || 1; 
    Params.page(searchChannel, $scope.page);
    $scope.total_pages = 0; 
    $scope.loader = true;
    $scope.loadedResults = false;
    $scope.noResults = false;
    $scope.setPage = function (page, url) {
      $location.path('/'+url+'/'+page);
    };
    $scope.pogMethod = function () {
      if (Params.get(searchChannel).pogMethod == 'plaza_groups') {
        return 'plaza'
      }
      return 'pog'
    };

    $scope.resolveSearch = function () {
      return Search.query(Params.get(searchChannel), function (data) {
        if (data.results.length == 0) {
          $scope.loader = false;
          $scope.noResults = true;
          return;
        }
        if (Object.keys(data.results).length == 1) {
          var keys = Object.keys(data.results);
          if (Params.get(searchChannel).pogMethod == 'plaza_groups') {
            $location.path('/plaza/'+keys[0]);
            $location.replace();
          } else {
            $location.path('/pog/'+keys[0]);
            $location.replace();
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
