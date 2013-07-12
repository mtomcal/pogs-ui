'use strict';

angular.module('pogsUiApp')
  .controller('SearchCtrl', function ($scope, $location, Params) {
    console.log($location.search());
  });
