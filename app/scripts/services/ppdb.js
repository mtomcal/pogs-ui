angular.module('pogsUiApp').
    factory('Ppdb', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/api/ppdb.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: false}
  });
});

