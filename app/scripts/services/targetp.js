angular.module('pogsUiApp').
    factory('Targetp', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/api/targetp.jsonp', {id: '@id', ortho: '@ortho', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: false}
  });
});

