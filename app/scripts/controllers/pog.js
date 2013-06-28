'use strict';

angular.module('pogsUiApp')
  .controller('PogCtrl', function ($scope, $routeParams, Pog) {
    $scope.test = [
      'Moe',
      'Larry',
      'Curly',
    ];
    $scope.pog = Pog.query({id: $routeParams.id});
  });
