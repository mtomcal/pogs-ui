angular.module('pogsUiApp')
.controller('BlastCtrl', function ($scope, $location, Blast, $location, $anchorScroll) {
  $scope.isCollapsed = true;
  $scope.showResults = false;
  $scope.loader = false;
  $scope.results;
  $scope.blast = {
    method: 'blastp',
    seq: '',
    matrix: 'PAM30',
    wordSize: '',
    openGap: '',
    extendGap: '',
    threshold: '',
    gapAlign: true,
    dropGap: '',
    dropUngap: '',
    EValue: '',
  };

  $scope.blastSearch = function () {
    $scope.loader = true;
    $scope.showResults = false;
    Blast.query($scope.blast, function (data) {
      $scope.loader = false;
      $scope.showResults = true;
      $scope.results = data.results;
    });
  };

  $scope.scrollTo = function(id) {
      console.log('Called');
      $location.hash(id);
      $anchorScroll();
  }
    
});
