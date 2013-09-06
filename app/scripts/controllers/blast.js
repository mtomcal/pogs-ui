angular.module('pogsUiApp')
.controller('BlastCtrl', function ($scope, Blast) {
  $scope.isCollapsed = true;
  $scope.showResults = false;
  $scope.loader = false;
  $scope.placeholder = "";
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

  $scope.$watch('blast.method', function () {
    if ($scope.blast.method == 'blastp') {
      $scope.placeholder = 'Protein Sequence (FASTA)'
    }
    if ($scope.blast.method == 'blastx') {
      $scope.placeholder = 'Nucleotide Sequence (FASTA)'
    }
  });

  $scope.blastSearch = function () {
    $scope.loader = true;
    $scope.showResults = false;
    Blast.query($scope.blast, function (data) {
      $scope.loader = false;
      $scope.showResults = true;
      $scope.results = data.results;
    });
  };
});
