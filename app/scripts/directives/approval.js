angular.module('pogsUiApp').
  directive('approval', function(){
    return {
      restrict: 'E',
      scope: {
        genemodels: '=',
        update: '=',
      },
      controller: function ($scope, Params, Search, Plaza) {
        $scope.approved = false;
        $scope.unapproved = false;
        $scope.resolve = function () {
          if ($scope.genemodels.length < 1) {
            return;
          }
          Params.clear();
          Params.set({
            tid: $scope.genemodels[0],
            type: 'byPOG',
            pogMethod: 'plaza_groups',
          });
          Search.query(Params.get(), function (search) {
            var keys = Object.keys(search.results);
            Plaza.query({id: keys[0]}, function (plaza) {
              var plaza_genes = _.map(plaza.locus, function (val) {
                return val.genemodel
              });
              var diff = _.difference(plaza_genes, $scope.genemodels);

              if (diff.length < 1 && plaza_genes.length == $scope.genemodels.length) {
                $scope.approved = true;
              } else {
                $scope.unapproved = true;
              };
            });
          });
        };

        $scope.$watch('update', function () {
          $scope.resolve();
        });

      },
      template: '<div ng-show="approved" class="approved inline"><h5><i class="icon-ok-sign icon-1x text-success"></i> Predictions are consistent with Plaza</h5></div><div ng-show="unapproved" class="unapproved inline"><h5><i class="icon-ban-circle icon-1x text-error"></i> Predictions are inconsistent with Plaza</h5></div>',
      link: function ($scope, element, attr) {

      },
    };
});


