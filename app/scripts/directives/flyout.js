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
  };

  ctrl.deactivate = function () {
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
      link: function (scope, element, attr) {
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
        $scope.toggle = function (show) {
          if (show) {
            $element.addClass('flyout-body');
            return;
          }
          $element.removeClass('flyout-body');
        }
      },
      template: '<div ng-transclude></div>',
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
      controller: function ($scope) {
        $scope.show = false;
        $scope.toggle = function (show) {
          if (show) {
            $scope.show = true;
            $scope.$apply();
            return;
          }
          $scope.show = false;
          //$scope.$apply();
        }
      },
      template: '<div ng-show="show" class="flyout"><div class="content" ng-transclude><a ng-click="close()" href="">Close</a></div></div>',
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
      template: '<button class="{{style}}" ng-transclude>Plaza</button>',
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


