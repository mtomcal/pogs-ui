angular.module('pogsUiApp').
  directive('atted', function(){
    return {
      restrict: 'E',
      scope: {
        locus: '=',
      },
      template: '<a class="btn btn-warning" tooltip-placement="bottom" tooltip="Click to learn about the gene coexpression network for the Arabidopsis ortholog" target="_blank" href="http://atted.jp/cgi-bin/locus.cgi?loc={{locus}}">ATTED-II Coexpression Database</a>',
      link: function (scope, element, attr) {
        scope.$watch('locus', function () {
          if (!scope.locus || !scope.locus.match(/()(AT[\w|\d]+)/)) {
            angular.element(element).hide();
          } else {
            angular.element(element).show();
          }
        });

      },
    };
});


