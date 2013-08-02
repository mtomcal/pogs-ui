angular.module('pogsUiApp').
    factory('Tree', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/tree.jsonp', {id: '@id', method: '@method', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});

