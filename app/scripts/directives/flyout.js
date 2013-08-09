angular.module('pogsUiApp').
  controller('FlyoutCtrl', function ($scope, $rootScope) {
  window.myscope = $rootScope;

  var ctrl = this;

  var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  var $nav = angular.element(".navbar");
  var $footer = angular.element("footer");

  $nav.removeClass('no-transition')
  $nav.addClass('out');
  $footer.removeClass('no-transition')
  $footer.addClass('out');

  ctrl.activate = function () {
    $nav
    .removeClass('out')
    .addClass('flyout-body');
    $footer
    .removeClass('out')
    .addClass('flyout-body');

    angular
    .element(".flyout")
    .one(transitionEnd,   
         function(e) {
           var locationChange = $rootScope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc){
             $nav.addClass('no-transition');
             $footer.addClass('no-transition');
             ctrl.deactivate();
             locationChange();
           });
         });
  };

  ctrl.deactivate = function () {
    $nav.addClass('out');
    $footer.addClass('out');
    angular.element("body").off('click');
    angular.element(".flyout").off('click');
  };

  ctrl.maximize = function () {
    $nav.addClass('extend');
    $footer.addClass('extend');
    angular
    .element(".flyout")
    .one(transitionEnd,   
         function(e) {
           angular.element(".plaza-tree").addClass('extend');
         });
    $rootScope.$broadcast('Flyout:overlay:redraw');

  };

  ctrl.minimize = function () {
    $nav.removeClass('extend');
    $footer.removeClass('extend');
    angular.element(".plaza-tree").removeClass('extend');
    $rootScope.$broadcast('Flyout:redraw');
  };

  ctrl.observers = {}

  ctrl.addObs = function (id, obs) {
    ctrl.observers[id] = obs;
    obs.task = {
      activate: false,
      maximize: false,
    }
  }

  ctrl.update = function (task) {
    _.each(ctrl.observers, function (obs, key) {
      obs.task = task;
      obs.update();
    });
    if (task.activate) {
      ctrl.activate();
    } else {
      ctrl.deactivate();
      ctrl.minimize();
    }

    if (task.maximize) {
      ctrl.maximize();
    } else {
      ctrl.minimize();
    }
  }

  $rootScope.$on('loadedPlazaPage', function () {
    ctrl.deactivate();
    ctrl.minimize();
  });
  
  $rootScope.$on('loadedPogPage', function () {
    ctrl.deactivate();
    ctrl.minimize();
  });

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
      template: '<div class="flyout-body out" ng-transclude></div>',
      link: function (scope, element, attr, FlyoutCtrl) {
        scope.task = {}
        FlyoutCtrl.addObs("body", scope);

        scope.update = function () {
          if (scope.task.activate) {
            element.removeClass('out');
          } else {
            element.addClass('out');
          }

          if (scope.task.maximize) {
            element.addClass('extend');
          } else {
            element.removeClass('extend');
          }
        }

      },
    };
});

angular.module('pogsUiApp').
  directive('flyout', function($rootScope){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      transclude: true,
      scope: {},
      template: '<div class="flyout out"><div class="content"><a ng-click="close()" href="">Close</a><div ng-transclude></div><button ng-click="maximize()" class="btn btn-primary btn-mini">Plaza Cladogram</button></div></div>',
      link: function (scope, element, attr, FlyoutCtrl) {
        scope.task = {}

        FlyoutCtrl.addObs("flyout", scope);

        scope.maximize = function () {
          FlyoutCtrl.update({
            activate: true,
            maximize: true,
          });
        }

        scope.update = function () {
          if (scope.task.activate) {
            element.find('.flyout').removeClass("out");
          } else {
            element.find('.flyout').addClass("out");
          }

          if (scope.task.maximize) {
            element.find('.flyout').addClass("extend");
          } else {
            element.find('.flyout').removeClass("extend");
          }
        }

        scope.close = function () {
          FlyoutCtrl.update({
            activate: false,
            maximize: false,
          });
          
        };

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

        element.bind('click', function () {
          FlyoutCtrl.update({
            activate: true,
            maximize: false,
          });
          scope.callback({gene: scope.gene});
        });
      },
    };
});


