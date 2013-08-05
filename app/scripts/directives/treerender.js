angular.module('pogsUiApp').
  directive('treerender', function($rootScope){
    return {
      restrict: 'E',
      scope: {
        genemodels: '=',
        tree: '=',
        url: '=',
        pogid: '=',
        divid: '@',
        color: '@',
        height: '@',
        width: '@',
        dy: '@',
        padding: '@',
      },
      transclude: true,
      template: '<small><p>Asterisks (*) mark members of this POG</p></small><div ng-transclude></div>',
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
      var draw = function () {
          if (typeof scope.padding == 'undefined') {
            scope.padding = 100;
          } else {
            scope.padding = parseInt(scope.padding);
          }
          if (scope.genemodels.length > 1 && typeof scope.tree[scope.pogid] != 'undefined') {
            processTree(scope.tree[scope.pogid], function (tree) {
              scope.divId = 'phylo_' + scope.divid;
              var dataObject = {
                phyloxml: tree,
                fileSource: false 
              }
              angular.element('#phylo_' + scope.divid).html("");
              var elem = angular.element('#phylo_' + scope.divid);
              Smits.PhyloCanvas.Render.Style.line.stroke = scope.color;
              Smits.PhyloCanvas.Render.Style.text.fill = scope.color;
              Smits.PhyloCanvas.Render.Style.text.highlight = scope.color;
              Smits.PhyloCanvas.Render.Style.text["font-size"] = 12;
              var render = new Smits.PhyloCanvas(dataObject,'phylo_' + scope.divid,parseInt(scope.width),parseInt(scope.height));
              angular.element('#phylo_' + scope.divid + '> svg').attr('height', parseInt(scope.height) + scope.padding);
              if (typeof scope.dy != "undefined") {
                var $ = angular.element;

                var unWatcher = scope.$watch(
                  function() {
                    return $('tspan').length != 0;
                  },
                  function() {

                    angular.element('tspan').attr('dy', '5');             

                    unWatcher();
                  }
               , true);
              }
            });
          }
        }
        scope.$watch('tree', draw);
        $rootScope.$on('Flyout:redraw', function () {
          if (scope.divid == 'pog') {
            Smits.PhyloCanvas.Render.Style.line.stroke = scope.color;
            Smits.PhyloCanvas.Render.Style.text.fill = scope.color;
            Smits.PhyloCanvas.Render.Style.text.highlight = scope.color;
            Smits.PhyloCanvas.Render.Style.text["font-size"] = 12;
          }
        });
        $rootScope.$on('Flyout:overlay:redraw', function () {
          if (scope.divid == 'plaza') {
            Smits.PhyloCanvas.Render.Style.line.stroke = scope.color;
            Smits.PhyloCanvas.Render.Style.text.fill = scope.color;
            Smits.PhyloCanvas.Render.Style.text.highlight = scope.color;
            Smits.PhyloCanvas.Render.Style.text["font-size"] = 12;
          }
        });
      },
    };
});


