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
    var channels = {};
    var clear = function (channel) {
      channels[channel] = _.clone(default_params);
    };
    return {
      set: function (channel, value) {
        clear(channel);
        _.each(value, function (val, key) {
          value[key] = val || '';
        });
        _.extend(channels[channel], value);
        $rootScope.$broadcast('Params:set');
      },
      get: function (channel) {
        return channels[channel];
      },
      page: function (channel, page) {
        channels[channel].page = page;
      },
      clear: function (channel) {
        clear(channel);
      }
    };
});
