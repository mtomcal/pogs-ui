'use strict';

angular.module('pogsUiApp')
.controller('MartCtrl', function ($scope, $location, $routeParams, Fasta, Align) {

  var dataset = $scope.dataset = $routeParams.dataset;
  var type = $scope.type = $routeParams.type;
  var id = $scope.id = $routeParams.id;

  $scope.loadedFasta = false;
  $scope.loadedAlign = false;
  $scope.loader = true;

  var loadFasta = function (dataset) {
    Fasta.query({id: $routeParams.id, dataset: dataset}, function (data) {
      $scope.fasta = [];
      _.each(data.fasta, function (value) {
        $scope.fasta.push(">" + value.genemodel + " | " + angular.element.trim(value.desc) + "\n");
        $scope.fasta.push(value.aa_seq + "\n\n");
      });
      $scope.fasta = $scope.fasta.join("");
      $scope.loadedFasta = true;
      $scope.loader = false;
    });
  }

  var loadAlign = function (dataset) {
    Align.query({id: $routeParams.id, dataset: dataset}, function (data) {
      $scope.align = data;
      $scope.loadedAlign = true;
      $scope.loader = false;
    });
  };

  if (!$scope.loadedFasta && type == 'fasta') {
    loadFasta(dataset);
  }

  if (!$scope.loadedAlign && type == 'align') {
    loadAlign(dataset);
  }
  $scope.back = function () {
    $location.path('/pog/' + id);
  }
});

