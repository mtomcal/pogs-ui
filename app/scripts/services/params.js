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
    var textfilter = function (term) {
      if (!term) {
        return '';
      }
      term = term + '';
      term = term.toLowerCase();
      term = term.replace(/([\w|\d]+)\s+or\s+/g, "$1 ");
      term = term.replace(/not\s+([\w|\d]+)\s*/g, "-$1 ");
      term = term.replace(/([\w|\d]+)\s+and\s+/g, "+$1 +");
      term = term.replace(/([\w|\d]+)(\+|\-)/g, "$1 +");
      term = term.replace(/[\']+/g, '"');
      return term;
    };
    return {
      set: function (channel, value) {
        clear(channel);
        _.each(value, function (val, key) {
          if (key == 'domain') {
            val = textfilter(val);
          }
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
