angular.module('pogsUiApp').
    factory('Prednls', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/prednls.jsonp', {id: '@id', ortho: '@ortho', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});

