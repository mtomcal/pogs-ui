angular.module('pogsUiApp').
    service('Params', function($rootScope){
    var default_params = {
      page: '1', 
      gene: '',
      tid: '',
      domain: '',
      pog: '',
      type: '',
      targetop: '',
      nucop: '',
      location: '',
      ppdb: '',
      pogMethod: '',
    };
    var params = _.clone(default_params);
    var clear = function () {
      params = _.clone(default_params);
    };
    return {
      set: function (value) {
        clear();
        _.each(value, function (val, key) {
          value[key] = val || '';
        });
        _.extend(params, value);
        $rootScope.$broadcast('Params:set');
      },
      get: function () {
        return params;
      },
      page: function (page) {
        params.page = page;
      },
      clear: function () {
        clear();
      }
    };
});
