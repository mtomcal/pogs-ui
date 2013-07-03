angular.module('pogsUiApp').
    factory('Targetp', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/targetp.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});

