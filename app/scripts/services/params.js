angular.module('pogsUiApp').
    factory('Params', function($resource){
    var default_params = {
      page: '', 
      gene: '',
      tid: '',
      domain: '',
      pog: '',
      type: '',
      targetop: '',
      nucop: '',
      location: '',
      ppdb: '',
    };
    var params = _.clone(default_params);
    return {
      set: function (value) {
        _.extend(params, value);
      },
      get: function () {
        return params;
      },
      clear: function () {
        params = _.clone(default_params);
      }
    };
});
