angular.module('pogsUiApp').
  controller('FlyoutCtrl', function ($scope) {

  var ctrl = this;

  ctrl.setFlyout = function (scope) {
    $scope.flyout = scope;
  }
  ctrl.setFlyoutBody = function (scope) {
    $scope.flyoutBody = scope;
  }

  ctrl.activate = function () {
    $scope.flyout.toggle(true);
    $scope.flyoutBody.toggle(true);
    angular
    .element(".flyout")
    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
         function(e) {
           var $ = angular.element;
           $("body").click('click.flyout', function (e) {
             if ($(e.target).is($('button#plazaflyout'))){
               return;
             };
             ctrl.deactivate();
           });
         });
  };

  ctrl.deactivate = function () {
    angular.element("body").off('.flyout');
    angular.element(".flyout").off();
    $scope.flyout.toggle(false);
    $scope.flyoutBody.toggle(false);
  };


});


angular.module('pogsUiApp').
  directive('flyoutarea', function(){
    return {
      restrict: 'E',
      scope: {},
      controller: 'FlyoutCtrl',
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function (scope, element, attr, FlyoutCtrl) {

      },
    };
});

angular.module('pogsUiApp').
  directive('flyoutbody', function(){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {},
      controller: function ($scope, $element) {
        angular.element(".navbar")
        .addClass('flyout-body')
        .addClass('out');
        angular.element("footer")
        .addClass('flyout-body')
        .addClass('out');

        $scope.toggle = function (show) {
          if (show) {
            angular.element(".navbar").removeClass('out');
            angular.element("footer").removeClass('out');
            $element.removeClass('out');
            return;
          }
          $element.addClass('out');
          angular.element(".navbar").addClass('out');
          angular.element("footer").addClass('out');
        }
      },
      template: '<div class="flyout-body out" ng-transclude></div>',
      link: function (scope, element, attr, FlyoutCtrl) {
        FlyoutCtrl.setFlyoutBody(scope);
      },
    };
});

angular.module('pogsUiApp').
  directive('flyout', function(){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function ($scope, $element) {
        $scope.show = false;
        $scope.toggle = function (show) {
          if (show) {
            $element.find('.flyout').removeClass("out");
            return;
          }
          $element.find('.flyout').addClass("out");
          //$scope.$apply();
        }
      },
      template: '<div class="flyout out"><div class="content" ng-transclude><a ng-click="close()" href="">Close</a></div></div>',
      link: function (scope, element, attr, FlyoutCtrl) {
        scope.close = function () {
          FlyoutCtrl.deactivate();
        };
        FlyoutCtrl.setFlyout(scope);
      },
    };
});

angular.module('pogsUiApp').
  directive('plazaflyout', function(){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      scope: {
        style: '@',
        gene: '@',
        callback: '&',
      },
      transclude: true,
      replace: true,
      template: '<button id="plazaflyout" class="{{style}}" ng-transclude>Plaza</button>',
      link: function (scope, element, attr, FlyoutCtrl) {

        scope.activate = function () {
          FlyoutCtrl.activate();
        }
        element.bind('click', function () {
          scope.activate();
          scope.callback({gene: scope.gene});
        });
      },
    };
});


