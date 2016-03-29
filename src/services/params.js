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
    var genefilter = function (term) {
      if (!term) {
        return '';
      }
      term = term + '';
      term = term.replace(/\_T/g, "_P");
      term = term.replace(/\_FGT/g, "_FGP");
      return term;
    };
    return {
      set: function (channel, value, broadcast) {
        clear(channel);
        _.each(value, function (val, key) {
          if (key == 'domain') {
            val = textfilter(val);
          }
          if (key == 'gene' || key == 'tid') {
            val = genefilter(val);
          };
          value[key] = val || '';
        });
        _.extend(channels[channel], value);
        if (broadcast == false) {
          return;
        }
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
