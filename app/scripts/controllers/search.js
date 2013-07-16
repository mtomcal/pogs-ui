'use strict';

angular.module('pogsUiApp')
  .controller('SearchCtrl', function ($scope, $location, $routeParams, Params, Search) {
    $scope.page = parseInt($routeParams.page) || 1; 
    Params.page($scope.page);
    $scope.total_pages = 0; 
    $scope.loader = true;
    $scope.loadedResults = false;
    $scope.noResults = false;
    $scope.setPage = function (page) {
      $location.path('/search/'+page);
    };
    $scope.results = Search.query(Params.get(), function (data) {
      if (data.results.length == 0) {
        $scope.loader = false;
        $scope.noResults = true;
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
