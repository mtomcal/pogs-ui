angular.module('pogsUiApp').
  directive('treerender', function(){
    return {
      restrict: 'E',
      scope: {
        genemodels: '=',
        tree: '=',
        url: '=',
        pogid: '=',
        divid: '@',
      },
      template: '<small><p>Asterisks (*) mark members of this POG</p></small><div id="{{divId}}"></div>',
      link: function (scope, element, attr) {
        
        var processTree = function (tree, cb) {
          var urlBase = scope.url;
          var $xml = angular.element(tree);
          var changeLength = function () {
            return $xml.find('branch_length').each(function() {
              angular.element(this).text('1');
            }).promise();
          }
          var changeAnnotation = function() {
            return $xml.find('name').each(function() {
              if (_.include(scope.genemodels, angular.element(this).text())) {
                var old_value = angular.element(this).text();
                angular.element(this).text(old_value + "*");
              } else {
                var addition = angular.element('<annotation><desc>Click to Search For ' + angular.element(this).text() + ' POG</desc><uri>'+ urlBase +'#/search/genemodel/' + angular.element(this).text() + '</uri></annotation>');
                angular.element(this).parent().append(addition);
              }
            }).promise();
          }
          angular.element
          .when(changeLength(), changeAnnotation())
          .done(cb($xml[2].outerHTML));
        }
       
        scope.$watch('tree', function () {
          if (scope.genemodels.length > 1 && typeof scope.tree[scope.pogid] != 'undefined') {
            processTree(scope.tree[scope.pogid], function (tree) {
              scope.divId = 'phylo_' + scope.divid;
              var dataObject = {
                phyloxml: tree,
                fileSource: false 
              }
              angular.element('#phylo_' + scope.divid).html("");
              new Smits.PhyloCanvas(dataObject,'phylo_' + scope.divid,1000,1000);
              angular.element('#phylo_' + scope.divid + '> svg').attr('height', '1100');
            });
          }
        });

      },
    };
});


