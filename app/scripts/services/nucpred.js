angular.module('pogsUiApp').
    factory('Nucpred', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/nucpred.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});

